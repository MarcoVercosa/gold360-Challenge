import { Channel } from "amqplib";
import { config } from "dotenv"
import { v4 as uuidV4 } from 'uuid';
//import { IRequestCancelActiveRegisterRepository } from "../../entities/requestCancelActiveRoute/IRequestCancelActiveRegisterRepository";
import { IRequestCancelRegisterUseCase, IParams, IInputsValidates, IReturn } from "../../entities/requestCancelRegisterRoute/IRequestCancelRegisterUseCase";
import { ValidadeToken } from "../../http/midwares/validateToken";
import { Logger } from "../../services/createLogs/createLogs";
import { CreateQueue } from "../../services/queues/createQueuesChannels";
import { RequestCancelValidationInpunt } from "./RequestCancelValidationInpunt"

export class RequestCancelRegisterUseCase implements IRequestCancelRegisterUseCase {
    constructor(
        //private requestCancelActiveRegisterRepository: IRequestCancelActiveRegisterRepository
    ) { }


    async CheckFirstQueueCancelRegisterBD(): Promise<Channel | any> {
        config()
        //create queue (if not exists), conection and channel 
        const connectionQueueCancelRegisterBD = await CreateQueue
            (
                process.env.CREDENTIALS_CANCEL_USER as string,
                process.env.CREDENTIALS_CANCEL_PASS as string,
                process.env.QUEUE_NAME_CANCEL_REGISTER as string
            )
        const connectionQueueCancelDead = await CreateQueue
            (
                process.env.CREDENTIALS_DEAD_QUEUE_USER as string,
                process.env.CREDENTIALS_DEAD_QUEUE_PASS as string,
                process.env.QUEUE_NAME_DEAD_CANCEL as string
            )
        return { connectionQueueCancelRegisterBD, connectionQueueCancelDead }
    }

    async Execute({ token, fullName, email }: IParams): Promise<{ sucess: boolean, token: string, result: IReturn }> {
        config()
        //check validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //VALIDATE THE INPUTS
            let validateInputs = RequestCancelValidationInpunt({ fullName, email }) as IInputsValidates
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result } as any
            }

            //CENTRALIZE THE DATA AND SEND TO QUEUE
            let { fullNameValidate, emailValidate } = validateInputs.result
            let dataJSON = {
                validateToken,
                fullName: fullNameValidate,
                email: emailValidate,
                comparatorKey: uuidV4()
                //THIS KEY IS A COMPARISON STRING. UPON RECEIVING THE QUEUE CONFIRMATION, 
                //YOU WILL COMPARE THIS KEY WITH THE ONE RECEIVED. IF THE REQUEST KEY IS THE SAME
                // AS THE ONE RECEIVED FROM THE CONFIRMATION QUEUE, THEN IT IS INDEED THE REQUEST'S RESPONSE
            }
            //checks if queues is created and accessible
            const { connectionQueueCancelRegisterBD, connectionQueueCancelDead } = await this.CheckFirstQueueCancelRegisterBD()
            if (!connectionQueueCancelRegisterBD || !connectionQueueCancelDead) {
                return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: Cancel queue  || Dead Cancel Queue" } as any
            }

            //CREATE THE QUEUE TEMPORARY TO RECEIVE DE CONFIRMATION WITH DATAS. WHEN THE DATA CONFIRMATION IS RECEIVED, THE CONNECTION IS CLOSE E THE QUEUE TEMPORARY IS DELETED
            let rpc = await connectionQueueCancelRegisterBD.assertQueue('', { exclusive: true, durable: false })
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE (replyTo => It is the queue temporary above created than response will be send) 
            connectionQueueCancelRegisterBD.sendToQueue(process.env.QUEUE_NAME_CANCEL_REGISTER as string, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue })


            //AFTER THE DATA IS SENT TO THE QUEUE. IN THE RETURN OF THE FUNCTION WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
            //WHERE IT WILL BE VALIDATED THROUGH THE COMPARISON KEY IF IT IS THE RESPONSE OF THE CURRENT REQUEST
            async function Return() {
                return new Promise((resolve, reject) => {
                    connectionQueueCancelRegisterBD.consume(rpc.queue, (data: any) => {
                        if (data.properties.correlationId == dataJSON.comparatorKey) {
                            Logger.info(`RABBITMQ => Data received e confirmed -- queue name: ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} -- from queue name temporary: ${rpc.queue} `)
                            resolve(JSON.parse(data.content))
                        }
                    })
                }).catch((err) => {
                    Logger.error(`RABBITMQ => error on consume queue temporary: ${rpc.queue} -- queue request:${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} -- error: ${err}`)
                    return err
                })
            }

            return { sucess: true, token, result: await Return() } as any

        } else {
            return { sucess: false, token, result: "Token invalid" } as any
        }
    }
}