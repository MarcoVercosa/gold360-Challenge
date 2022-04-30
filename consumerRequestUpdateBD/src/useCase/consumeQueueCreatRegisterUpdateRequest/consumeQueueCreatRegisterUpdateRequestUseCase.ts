import { ICreatRegisterUpdateRequestUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestUseCase"
import { CreateRegisterUpdateRequestRepository } from "../../repository/CreatRegisterUpdateRequestRepository"
import { ConnectAMQPQueueServe } from "../../manageQueues";

export class ConsumeQueueCreatRegisterUpdateRequestUseCase implements ICreatRegisterUpdateRequestUseCase {

    AMQPQueueServer: string;
    nameQueueCreateUpdateBD: string;
    connectionQueue: any;
    nameQueueConfirmCreateUpdateBD: string;
    connectionQueueConfirmCreateUpdateBD: any
    dataQueueConsumed: IParams

    constructor(
        AMQPQueueServer: string, //url connection server
        NameQueueCreateUpdateBD: string, // queue name create update bd
        nameQueueConfirmCreateUpdateBD: string,// queue name confirm create update bd
        private createRegisterUpdateRequestRepository: CreateRegisterUpdateRequestRepository, //repository bd
    ) {
        this.AMQPQueueServer = AMQPQueueServer
        this.nameQueueCreateUpdateBD = NameQueueCreateUpdateBD
        this.connectionQueue = null
        //store the conection by ConsumeQueueCreateUpdateBD() than is used by SendConfirmQueueCreateUpdateBD(). Is used to send dat and keep only connection. Avoiding leaving connections and channels open
        this.nameQueueConfirmCreateUpdateBD = nameQueueConfirmCreateUpdateBD
        this.dataQueueConsumed = this.ConsumeQueueCreateUpdateBD() as any
        //to intance de class, call function check connection with channel, activate the listener consumer and store in object the data consumed 
        //is greate to execute the consume lister connection once
    }

    async ConsumeQueueCreateUpdateBD(): Promise<{ sucess: boolean, result: string } | null> {
        console.log("solicitado criação de conexão para consume")
        let { channelOpen } = await ConnectAMQPQueueServe(this.AMQPQueueServer)
        if (!channelOpen) {
            return null
        }

        this.connectionQueue = channelOpen
        let resultData: Promise<{ sucess: boolean, result: string }>
        resultData = await channelOpen.consume(this.nameQueueCreateUpdateBD,
            async (data: any) => {
                let dataConsume: any = await JSON.parse(data.content)///change from  buffer to object                
                this.dataQueueConsumed = dataConsume
                channelOpen?.ack(data)
                return await this.Execute()
            }, { noAck: false }
        ) as any
        return resultData
    }

    async SendConfirmQueueCreateUpdateBD(data: any): Promise<any> {
        console.log("Enviado CONFIRMAÇÃO para: " + this.nameQueueConfirmCreateUpdateBD)
        this.connectionQueue.sendToQueue(this.nameQueueConfirmCreateUpdateBD, Buffer.from(JSON.stringify(data)))
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
                this.SendConfirmQueueCreateUpdateBD({ comparatorKey: this.dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" })
                return { sucess: true, result: "The Register is NOT MODIFIELD" } as any
            }
            if (resultBD == 1) {
                console.log({ sucess: true, result: "Register CREATED successfully" })
                this.SendConfirmQueueCreateUpdateBD({ comparatorKey: this.dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" })
                return { sucess: true, result: "Register CREATED successfully" }
            }
            if (resultBD == 2) {
                console.log({ sucess: true, result: "Register UPDATED successfully" })
                this.SendConfirmQueueCreateUpdateBD({ comparatorKey: this.dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" })
                return { sucess: true, result: "Register UPDATED successfully" }
            }
        } catch (err: any) {
            console.log(err)
            return { sucess: true, result: err }
        }
    }

}