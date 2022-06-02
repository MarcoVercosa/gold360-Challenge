import { Channel } from "amqplib"
import { IConsumerCancelRegisterUseCase, IParams } from "../entities/IConsumerCancelRegisterUseCase"
import { ConsumerCancelRegisterRepository } from "../repository/consumerCancelRegisterRepository"
import { Logger } from "../services/createLogs/createLogs";
import { ConnectAMQPQueueServer, ConnectCancelDeadQueue } from "../services/manageQueues/index"
import { ConnectionsName } from "../services/connections/index"

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
        ConnectAMQPQueueServer()
            .then((data: any) => {
                let { channelOpen, connection } = data as { channelOpen: Channel, connection: any }
                connection.once("error", (error: any) => {
                    Logger.error(`Rabbitmq => ERROR DETECTED TO CREATE CONNECTION and consume queue -- ${error} -- New try in 5 secs`)
                    setTimeout(() => {
                        connection.close()
                        channelOpen.close()
                        this.ConnectAndConsume()
                    }, 5000)
                })
                connection.once("close", (error: any) => {
                    Logger.error(`Rabbitmq => CLOSE DETECTED IN CONNECTION ALREADY CREATED -- ${error} -- New try in 5 secs`)
                    setTimeout(() => {
                        connection.close()
                        channelOpen.close()
                        this.ConnectAndConsume()
                    }, 5000)
                })
                this.connectionQueue = channelOpen
                this.Consume() // ====>  Call Consumer
            }).catch((error: any) => {
                this.connectionQueue
                Logger.error(`SOMETHING WRONG HAPPENED HERE TO CONNECT RABBITMQ -- ${error} New try in 5 secs`)
                setTimeout(() => {
                    this.ConnectAndConsume()
                }, 2000)
            })
    }
    async Consume() {
        let connections = ConnectionsName()
        if (this.connectionQueue) {
            this.connectionQueue.consume(connections.queueNameCancelRegister,
                async (reply: any) => {
                    let { replyTo, correlationId } = reply.properties
                    let dataConsume: IParams = JSON.parse(reply.content)///change from  buffer to object
                    Logger.info(`Rabbitmq => [XXXX] The Consumer to ${connections.queueNameCancelRegister} received data.`)
                    let result = await this.Execute(dataConsume) as Promise<{ sucess: boolean, comparatorKey: string, message: string }>
                    //reply the confirmation with data to queue temporary
                    this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), { correlationId })
                    this.connectionQueue.ack(reply)
                    Logger.info(`Rabbitmq => [XXXX] The confirmation to  ${connections.queueNameCreateUpdateRegisterBD} was sent.`)
                }, { noAck: false }//avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            ) as any
        }
    }


    async Execute(dataQueueConsumed: IParams): Promise<any> {
        let connections = ConnectionsName()
        try {
            let isAdmin: boolean = await this.consumerCancelRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName })
            if (!isAdmin) { return { sucess: true, comparatorKey: "", message: "Permission denied" } }
            //cancel if is not admin

            //Check if user is active in BD
            let checkIfIsActiveRegisteBD = await this.consumerCancelRegisterRepository.CheckIfIsActiveRepository({
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
            })

            //if email or passowrd not match in BD
            if (checkIfIsActiveRegisteBD.length < 1) {
                return { sucess: false, comparatorKey: dataQueueConsumed.comparatorKey, message: "FullName or/and email not found" }
            }

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
            if (!checkIfIsActiveRegisteBD[0]?.active) {
                let result = {
                    sucess: false,
                    data: {
                        fullName: dataQueueConsumed.fullName,
                        email: dataQueueConsumed.email
                    },
                    result: "Register is already disabled. There was no change in DataBase. Sent to queue dead."
                }
                let channel = await ConnectCancelDeadQueue() as Channel
                channel.sendToQueue(connections.queueNameDeadCancel as string, Buffer.from(JSON.stringify(result)))
                return { sucess: false, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register is already disabled. There was no change in DataBase. Sent to Queue Dead" }
            }

        } catch (error: any) {
            Logger.error(`REPOSITORY => SOMETHING WRONG HAPPENED HERE -- ${error}`)
            return { sucess: true, comparatorKey: "", message: error }
        }
    }
}


