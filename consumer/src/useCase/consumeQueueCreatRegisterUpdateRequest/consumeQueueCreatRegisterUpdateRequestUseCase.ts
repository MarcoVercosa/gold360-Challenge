
import { Channel, connect } from "amqplib"
import { ICreatRegisterUpdateRequestUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestUseCase"
import { CreateRegisterUpdateRequestRepository } from "../../repository/CreatRegisterUpdateRequestRepository"



export class ConsumeQueueCreatRegisterUpdateRequestUseCase implements ICreatRegisterUpdateRequestUseCase {

    AMQPQueueServer: string
    nameQueue: string
    channel: Channel | null
    dataQueue: IParams

    constructor(
        AMQPQueueServer: string,
        NameQueue: string,
        private createRegisterUpdateRequestRepository: CreateRegisterUpdateRequestRepository,
    ) {
        this.AMQPQueueServer = AMQPQueueServer
        this.nameQueue = NameQueue
        this.channel = null
        this.dataQueue = this.ConsumeQueue() as any
        //to intance de class, call function than check connection with channel and store in object the data consumed 
    }

    //conect with habitmq and create the queue. If already create, do nothing.
    async ConnectAMQPQueueServer(): Promise<Channel | null> {
        try {
            const connection = await connect(this.AMQPQueueServer)
            const channelOpen = await connection.createChannel()
            console.log("Connected to habbitMQ.")
            this.channel = channelOpen
            return channelOpen
        } catch (err) {
            console.log("Error to connect to RabbitMQ. We try again in 5 seconds" + err)
            setTimeout(() => {
                this.ConsumeQueue()
            }, 5000)
            return null
        }
    }

    async ConsumeQueue(): Promise<{ sucess: boolean, result: string } | null> {

        let OpenConectionQueue = await this.ConnectAMQPQueueServer()
        if (!OpenConectionQueue) {
            return null
        }
        let resultData: Promise<{ sucess: boolean, result: string }>
        resultData = await OpenConectionQueue.consume(this.nameQueue,
            async (data: any) => {
                let dataConsume: any = await JSON.parse(data.content.toString())//change de buffer to string and JSON.parse to object                
                this.dataQueue = dataConsume
                OpenConectionQueue?.ack(data)
                return await this.Execute()
            }, { noAck: false }
        ) as any

        return resultData
    }

    async Execute() {
        let isAdmin = await this.createRegisterUpdateRequestRepository.UserIsAdminConfirm({ idToken: this.dataQueue.idToken, fullNameToken: this.dataQueue.fullNameToken })
        if (!isAdmin) { return { sucess: true, result: "Permission denied" } }//cancel if is not admin

        let resultBD: number = await this.createRegisterUpdateRequestRepository.RequestRegisterCreateUpdateRepository({
            firstName: this.dataQueue.firstName,
            fullName: this.dataQueue.fullName,
            email: this.dataQueue.email,
            password: this.dataQueue.password,
            lastUpDateBy: this.dataQueue.fullName
        })

        if (resultBD == 0) {
            console.log({ sucess: true, result: "The Register is NOT MODIFIELD" })
            return { sucess: true, result: "The Register is NOT MODIFIELD" } as any
        }
        if (resultBD == 1) {
            console.log({ sucess: true, result: "Register CREATED successfully" })
            return { sucess: true, result: "Register CREATED successfully" }
        }
        if (resultBD == 2) {
            console.log({ sucess: true, result: "Register UPDATED successfully" })
            return { sucess: true, result: "Register UPDATED successfully" }
        }
    }

}