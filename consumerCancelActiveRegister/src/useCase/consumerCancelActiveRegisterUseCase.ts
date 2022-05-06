import { Channel } from "amqplib"
import { IConsumerCancelActiveRegisterUseCase, IParams } from "../entities/IConsumerCancelActiveRegisterUseCase"
import { ConsumerCancelActiveRegisterRepository } from "../repository/consumerCancelActiveRegisterRepository"
import { ConnectAMQPQueueServe } from "../utils/manageQueues/index"

export class ConsumerCancelActiveRegisterUseCase implements IConsumerCancelActiveRegisterUseCase {
    connectionQueue: any;
    constructor(
        private consumerCancelActiveRegisterRepository: ConsumerCancelActiveRegisterRepository, //repository bd

    ) {
        this.connectionQueue = null
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }


    async ConnectAndConsume() {
        ConnectAMQPQueueServe(process.env.AMQP_QUEUE_SERVER as string)
            .then((data: any) => {
                let { channelOpen, connection } = data as { channelOpen: Channel, connection: any }
                connection.once("close", (error: any) => {
                    console.log("the connection was closed. We try again in 2 secs", error)
                    setTimeout(() => {
                        this.ConnectAndConsume()
                    }, 2000)
                })
                connection.once("error", (error: any) => {
                    console.log("Error detected on connection.We try again in 2 secs", error)
                    setTimeout(() => {
                        this.ConnectAndConsume()
                    }, 2000)
                })
                this.connectionQueue = channelOpen
                this.Consume()
            }).catch((err: any) => {
                this.connectionQueue
                console.log("Something wrong happened here. We try again in 2 secs", err.connection.cause)
                setTimeout(() => {
                    this.ConnectAndConsume()
                }, 2000)
            })
    }
    async Consume() {
        if (this.connectionQueue) {
            this.connectionQueue.consume(process.env.QUEUE_NAME_CANCEL_ACTIVE_REGISTER as string,
                async (reply: any) => {
                    console.log(reply)
                    let { replyTo, correlationId } = reply.properties
                    let dataConsume: IParams = JSON.parse(reply.content)///change from  buffer to object
                    console.log(" [XXXX] The server received data")
                    let result = await this.Execute(dataConsume) as Promise<{ sucess: boolean, comparatorKey: string, message: string }>
                    //reply the confirmation with data to queue temporary
                    this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify("reeesult")), { correlationId })
                    this.connectionQueue.ack(reply)
                    console.log(" [XXXX] The server sent a data")
                }, { noAck: false }//avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            ) as any
        }
    }


    async Execute(dataQueueConsumed: IParams): Promise<any> {
        console.log(dataQueueConsumed)
        // try {
        //     let isAdmin: boolean = await this.consumerCancelActiveRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName })
        //     if (!isAdmin) { return { sucess: true, comparatorKey: "", message: "Permission denied" } }
        //     //cancel if is not admin

        //     let resultBD: any = await this.consumerCancelActiveRegisterRepository.CancelActiveRegisterRepository({
        //         fullName: dataQueueConsumed.fullName,
        //         email: dataQueueConsumed.email,
        //         active: dataQueueConsumed.active
        //     })

        //     if (resultBD == 0) {
        //         console.log({ sucess: true, result: "The Register is NOT MODIFIELD" })
        //         return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" }
        //     }
        //     if (resultBD == 1) {
        //         console.log({ sucess: true, result: "Register CREATED successfully" })
        //         return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" }
        //     }
        //     if (resultBD == 2) {
        //         console.log({ sucess: true, result: "Register UPDATED successfully" })
        //         return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" }
        //     }
        // } catch (err: any) {
        //     console.log(err)
        //     return { sucess: true, comparatorKey: "", message: err }
        // }
    }
}