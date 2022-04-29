
import { Channel, connect } from "amqplib"
import { ICreatRegisterUpdateRequestUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestUseCase"
import { CreateRegisterUpdateRequestRepository } from "../../repository/CreatRegisterUpdateRequestRepository"
import { ConnectAMQPQueueServe } from "../../manageQueues";



export class ConsumeQueueCreatRegisterUpdateRequestUseCase implements ICreatRegisterUpdateRequestUseCase {

    AMQPQueueServer: string;
    nameQueueCreateUpdateBD: string;
    channelQueueCreateUpdateBD: Channel | null;
    nameQueueConfirmCreateUpdateBD: string;
    channelQueueConfirmCreateUpdateBD: Channel | null;
    dataQueueConsumed: IParams

    constructor(
        AMQPQueueServer: string,
        NameQueueCreateUpdateBD: string,
        ChannelQueueCreateUpdateBD: string,
        private createRegisterUpdateRequestRepository: CreateRegisterUpdateRequestRepository,
    ) {
        this.AMQPQueueServer = AMQPQueueServer
        this.nameQueueCreateUpdateBD = NameQueueCreateUpdateBD
        this.channelQueueCreateUpdateBD = null
        this.nameQueueConfirmCreateUpdateBD = ChannelQueueCreateUpdateBD
        this.channelQueueConfirmCreateUpdateBD = null
        this.dataQueueConsumed = this.ConsumeQueueCreateUpdateBD() as any
        //to intance de class, call function than check connection with channel and store in object the data consumed 
    }

    //conect with habitmq and create the queue. If already create, do nothing.
    // async ConnectAMQPQueueServeCreateUpdateBD(): Promise<Channel | null> {
    //     try {
    //         const connection = await connect(this.AMQPQueueServer)
    //         const channelOpen = await connection.createChannel()
    //         console.log("Connected to habbitMQ.")
    //         this.channelQueueCreateUpdateBD = channelOpen
    //         return channelOpen
    //     } catch (err) {
    //         console.log("Error to connect to RabbitMQ. We try again in 5 seconds" + err)
    //         setTimeout(() => {
    //             this.ConnectAMQPQueueServeCreateUpdateBD()
    //         }, 5000)
    //         return null
    //     }
    // }


    async ConsumeQueueCreateUpdateBD(): Promise<{ sucess: boolean, result: string } | null> {
        let OpenConectionQueue = await ConnectAMQPQueueServe(this.AMQPQueueServer)
        this.channelQueueCreateUpdateBD = OpenConectionQueue
        if (!OpenConectionQueue) {
            return null
        }
        let resultData: Promise<{ sucess: boolean, result: string }>
        console.log(this.nameQueueCreateUpdateBD)
        resultData = await OpenConectionQueue.consume(this.nameQueueCreateUpdateBD,
            async (data: any) => {
                let dataConsume: any = await JSON.parse(data.content)///change from  buffer to object                
                console.log(dataConsume)
                this.dataQueueConsumed = dataConsume
                OpenConectionQueue?.ack(data)
                return await this.Execute()
            }, { noAck: false }
        ) as any

        return resultData
    }

    async SendConfirmQueueCreateUpdateBD(data: any): Promise<any> {
        console.log(data)
        console.log("Solicitado envio de confirmação para fila" + this.AMQPQueueServer)
        let OpenConectionQueue = await ConnectAMQPQueueServe(this.AMQPQueueServer)
        if (!OpenConectionQueue) {
            return null
        }
        OpenConectionQueue.sendToQueue(this.nameQueueConfirmCreateUpdateBD, Buffer.from(JSON.stringify(data)), { persistent: true })

    }

    async Execute() {
        try {
            let isAdmin = await this.createRegisterUpdateRequestRepository.UserIsAdminConfirm({ idToken: this.dataQueueConsumed.validateToken.result.id, fullNameToken: this.dataQueueConsumed.validateToken.result.fullName })
            if (!isAdmin) { return { sucess: true, result: "Permission denied" } }//cancel if is not admin

            let resultBD: number = await this.createRegisterUpdateRequestRepository.RequestRegisterCreateUpdateRepository({
                firstName: this.dataQueueConsumed.firstName,
                fullName: this.dataQueueConsumed.fullName,
                email: this.dataQueueConsumed.email,
                password: this.dataQueueConsumed.password,
                lastUpDateBy: this.dataQueueConsumed.fullName
            })

            if (resultBD == 0) {
                console.log({ sucess: true, result: "The Register is NOT MODIFIELD" })
                this.SendConfirmQueueCreateUpdateBD({ fullName: this.dataQueueConsumed.fullName, message: "The Register is NOT MODIFIELD" })
                return { sucess: true, result: "The Register is NOT MODIFIELD" } as any
            }
            if (resultBD == 1) {
                console.log({ sucess: true, result: "Register CREATED successfully" })
                this.SendConfirmQueueCreateUpdateBD({ fullName: this.dataQueueConsumed.fullName, message: "Register CREATED successfully" })
                return { sucess: true, result: "Register CREATED successfully" }
            }
            if (resultBD == 2) {
                console.log({ sucess: true, result: "Register UPDATED successfully" })
                this.SendConfirmQueueCreateUpdateBD({ fullName: this.dataQueueConsumed.fullName, message: "Register UPDATED successfully" })
                return { sucess: true, result: "Register UPDATED successfully" }
            }
        } catch (err: any) {
            console.log(err)
            return { sucess: true, result: err }
        }
    }

}