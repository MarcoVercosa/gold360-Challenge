import { Channel } from "amqplib"
import { IConsumerCreateUpdateRegisterUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/IConsumerCreateUpdateRegisterUseCase"
import { ConsumerCreateUpdateRegisterRepository } from "../../repository/CreatRegisterUpdateRequestRepository"
import { ConnectAMQPQueueServe } from "../../services/manageQueues";

export class ConsumerCreateUpdateRegisterUseCase implements IConsumerCreateUpdateRegisterUseCase {
    connectionQueue: any;
    constructor(
        private consumerCreateUpdateRegisterRepository: ConsumerCreateUpdateRegisterRepository, //repository bd

    ) {
        this.connectionQueue = null
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }


    async ConnectAndConsume() {
        try {
            let { channelOpen, connection }: { channelOpen: Channel, connection: any } = await ConnectAMQPQueueServe()
            connection.once("error", (error: any) => {
                console.log("Error detected on connection.We try again in 2 secs", error)
                setTimeout(() => {
                    connection.close()
                    channelOpen.close()
                    this.ConnectAndConsume()
                }, 2000)
            })
            connection.once("close", (error: any) => {
                console.log("CLOSE detected on connection.We try again in 2 secs", error)
                setTimeout(() => {
                    connection.close()
                    channelOpen.close()
                    this.ConnectAndConsume()
                }, 2000)
            })
            this.connectionQueue = channelOpen
            this.Consume()
        } catch (err: any) {
            console.log("Something wrong happened here. We try again in 2 secs", err.connection.cause)
            setTimeout(() => {
                this.ConnectAndConsume()
            }, 2000)
        }


    }
    async Consume() {
        if (this.connectionQueue) {
            this.connectionQueue.consume(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
                async (reply: any) => {
                    console.log(reply)
                    let { replyTo, correlationId } = reply.properties
                    let dataConsume: IParams = JSON.parse(reply.content)///change from  buffer to object
                    console.log(" [XXXX] The server received data")
                    let result = await this.Execute(dataConsume) as Promise<{ sucess: boolean, comparatorKey: string, message: string }>
                    //reply the confirmation with data to queue temporary
                    this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), { correlationId })
                    this.connectionQueue.ack(reply)
                    console.log(" [XXXX] The server sent a data")
                }, { noAck: false }//avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            ) as any
        }
    }


    async Execute(dataQueueConsumed: IParams): Promise<any> {
        console.log(dataQueueConsumed)
        try {
            let isAdmin: boolean = await this.consumerCreateUpdateRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName })
            if (!isAdmin) { return { sucess: true, comparatorKey: "", message: "Permission denied" } }
            //cancel if is not admin

            let resultBD: number = await this.consumerCreateUpdateRegisterRepository.RequestRegisterCreateUpdateRepository({
                firstName: dataQueueConsumed.firstName,
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
                password: dataQueueConsumed.password,
                lastUpDateBy: dataQueueConsumed.fullName
            })
            if (resultBD == 0) {
                console.log({ sucess: true, result: "The Register is NOT MODIFIELD" })
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" }
            }
            if (resultBD == 1) {
                console.log({ sucess: true, result: "Register CREATED successfully" })
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" }
            }
            if (resultBD == 2) {
                console.log({ sucess: true, result: "Register UPDATED successfully" })
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" }
            }
        } catch (err: any) {
            console.log(err)
            return { sucess: true, comparatorKey: "", message: err }
        }
    }
}