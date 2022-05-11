import { Channel } from "amqplib"
import { IConsumerCancelRegisterUseCase, IParams } from "../entities/IConsumerCancelRegisterUseCase"
import { ConsumerCancelRegisterRepository } from "../repository/consumerCancelRegisterRepository"
import { ConnectAMQPQueueServe, ConnectCancelDeadQueue } from "../services/manageQueues/index"

export class ConsumerCancelRegisterUseCase implements IConsumerCancelRegisterUseCase {
    connectionQueue: any;
    constructor(
        private consumerCancelRegisterRepository: ConsumerCancelRegisterRepository, //repository bd

    ) {
        this.connectionQueue = null
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }


    async ConnectAndConsume() {
        ConnectAMQPQueueServe()
            .then((data: any) => {
                let { channelOpen, connection } = data as { channelOpen: Channel, connection: any }
                connection.once("error", (error: any) => {
                    console.log("ERROR detected on connection.We try again in 2 secs", error)
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
                this.Consume() // ====>  Call Consumer
            }).catch((err: any) => {
                this.connectionQueue
                console.log("Something wrong happened here. We try again in 2 secssssss", err.connection.cause)
                setTimeout(() => {
                    this.ConnectAndConsume()
                }, 2000)
            })
    }
    async Consume() {
        if (this.connectionQueue) {
            this.connectionQueue.consume(process.env.QUEUE_NAME_CANCEL_REGISTER as string,
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
            let isAdmin: boolean = await this.consumerCancelRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName })
            if (!isAdmin) { return { sucess: true, comparatorKey: "", message: "Permission denied" } }
            //cancel if is not admin

            //Check if user is active in BD
            let checkIfIsActiveRegisteBD = await this.consumerCancelRegisterRepository.CheckIfIsActiveRepository({
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
            })

            if (checkIfIsActiveRegisteBD.length > 0) {

                //If Register is  enabled so change to disable
                if (checkIfIsActiveRegisteBD[0]?.active) {
                    let result = await this.consumerCancelRegisterRepository.CancelRegisterRepository({
                        fullName: dataQueueConsumed.fullName,
                        email: dataQueueConsumed.email,
                    })
                    if (result > 0) {
                        return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register changed to Disabled" }
                    }
                }

                //If Register is already disable in the bd. Don't do anything in BD and send to queue dead
                if (!checkIfIsActiveRegisteBD[0].active) {
                    let result = {
                        sucess: true,
                        data: {
                            fullName: dataQueueConsumed.fullName,
                            email: dataQueueConsumed.email
                        },
                        result: "Register is already disabled. There was no change in DataBase. Sent to queue dead."
                    }
                    let channel = await ConnectCancelDeadQueue() as Channel
                    channel.sendToQueue(process.env.QUEUE_NAME_DEAD_CANCEL as string, Buffer.from(JSON.stringify(result)))
                    return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register is already disabled. There was no change in DataBase. Sent to Queue Dead" }
                }
            } else {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "FullName or/and email not found" }
            }


        } catch (err: any) {
            console.log(err)
            return { sucess: true, comparatorKey: "", message: err }
        }
    }
}


