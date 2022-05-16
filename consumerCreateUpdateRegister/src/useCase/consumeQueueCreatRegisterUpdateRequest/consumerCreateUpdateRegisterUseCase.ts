import { Channel } from "amqplib"
import { IConsumerCreateUpdateRegisterUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/IConsumerCreateUpdateRegisterUseCase"
import { ConsumerCreateUpdateRegisterRepository } from "../../repository/CreatRegisterUpdateRequestRepository"
import { Logger } from "../../services/createLogs/createLogs";
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
                Logger.error(`Rabbitmq => ERROR DETECTED TO CREATE CONNECTION and consumed queue -- ${error} -- New try in 5 secs`)
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
            this.Consume()
        } catch (error: any) {
            Logger.error(`SOMETHING WRONG HAPPENED HERE TO CONNECT RABBITMQ -- ${error} New try in 5 secs`)
            setTimeout(() => {
                this.ConnectAndConsume()
            }, 5000)
        }


    }
    async Consume() {
        if (this.connectionQueue) {
            this.connectionQueue.consume(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
                async (reply: any) => {
                    let { replyTo, correlationId } = reply.properties
                    let dataConsume: IParams = JSON.parse(reply.content)///change from  buffer to object
                    Logger.info(`Rabbitmq => [XXXX] The Consumer to ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} received data.`)
                    let result = await this.Execute(dataConsume) as Promise<{ sucess: boolean, comparatorKey: string, message: string }>
                    //reply the confirmation with data to queue temporary
                    this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), { correlationId })
                    this.connectionQueue.ack(reply)
                    Logger.info(`Rabbitmq => [XXXX] The confirmation to  ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} was sent.`)
                }, { noAck: false }//avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            ) as any
        }
    }

    async Execute(dataQueueConsumed: IParams): Promise<any> {
        try {
            let isAdmin: boolean = await this.consumerCreateUpdateRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName })
            if (!isAdmin) { return { sucess: false, comparatorKey: "", message: "Permission denied" } }
            //cancel if is not admin

            let resultBD: number = await this.consumerCreateUpdateRegisterRepository.RequestRegisterCreateUpdateRepository({
                firstName: dataQueueConsumed.firstName,
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
                password: dataQueueConsumed.password,
                lastUpDateBy: dataQueueConsumed.fullName
            })
            if (resultBD == 0) {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" }
            }
            if (resultBD == 1) {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" }
            }
            if (resultBD == 2) {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" }
            }
        } catch (error: any) {
            Logger.error(`REPOSITORY => SOMETHING WRONG HAPPENED HERE -- ${error}`)
            return { sucess: true, comparatorKey: "", message: error }
        }
    }
}