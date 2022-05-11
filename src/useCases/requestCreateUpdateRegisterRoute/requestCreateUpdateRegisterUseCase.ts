import { Channel } from "amqplib";
import { config } from "dotenv"
import { v4 as uuidV4 } from 'uuid';
import { IRequestRegisterRepository } from '../../entities/requestCreateUpdateRegisterRoute/IRequestRegisterRepository';
import { IRequestCreateUpdateRegisterUseCase, IParams, IInputsValidates, IReturn } from '../../entities/requestCreateUpdateRegisterRoute/IRequestRegisterUseCase';
import { ValidadeToken } from '../../http/midwares/validateToken';
import { CreateQueue } from '../../services/queues/createQueuesChannels';
import { RequestCreateUpdateRegisterValidationInpunt } from "./requestCreateUpdateRegisterValidationInpunt"


config()
export class RequestCreateUpdateRegisterUseCase implements IRequestCreateUpdateRegisterUseCase {

    constructor() { }

    async CheckFirstQueueCreateUpdateRegisterBD(): Promise<Channel | any> {
        const isCreateQueue = await CreateQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string)
        return isCreateQueue
    }

    async Execute({ token, fullName, email, password }: IParams): Promise<{ sucess: boolean, token: string, result: IReturn }> {

        //VALIDATE TOKEN
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //VALIDATE DE INPUTS
            let validateInputs = RequestCreateUpdateRegisterValidationInpunt({ fullName, email, password }) as IInputsValidates
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result } as any
            }

            //CENTRALIZE THE DATA AND SEND TO QUEUE
            let { firstNameValidate, fullNameValidate, emailValidate, passwordValidate } = validateInputs.result

            let dataJSON = {
                validateToken,
                firstName: firstNameValidate,
                fullName: fullNameValidate,
                email: emailValidate,
                password: passwordValidate,
                comparatorKey: uuidV4()
                //THIS KEY IS A COMPARISON STRING. UPON RECEIVING THE QUEUE CONFIRMATION, 
                //YOU WILL COMPARE THIS KEY WITH THE ONE RECEIVED. IF THE REQUEST KEY IS THE SAME
                // AS THE ONE RECEIVED FROM THE CONFIRMATION QUEUE, THEN IT IS INDEED THE REQUEST'S RESPONSE
            }
            //checks if queues is created and accessible
            const connectionQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCreateUpdateRegisterBD()
            if (!connectionQueueCreateUpdateRegisterBD) {
                return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: create_update_register_bd / confirm_create_update_register_bd." } as any
            }

            //CREATE THE QUEUE TEMPORARY TO RECEIVE DE CONFIRMATION WITH DATAS. WHEN THE DATA CONFIRMATION IS RECEIVED, THE CONNECTION IS CLOSE E THE QUEUE TEMPORARY IS DELETED
            let rpc = await connectionQueueCreateUpdateRegisterBD.assertQueue('', { exclusive: true, durable: false })
            console.log("Create queue RPC temporary -- queue of return confirmation--  wit the name ", rpc)
            connectionQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue })
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE

            //AFTER THE DATA IS SENT TO THE QUEUE. WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
            //WHERE IT WILL BE VALIDATED THROUGH THE COMPARISON KEY IF IT IS THE RESPONSE OF THE CURRENT REQUEST

            async function Return() {
                return new Promise((resolve, reject) => {
                    connectionQueueCreateUpdateRegisterBD.consume(rpc.queue, (data: any) => {
                        console.log("confirmação recebida da fila ", rpc.queue)
                        if (data.properties.correlationId == dataJSON.comparatorKey) {
                            console.log("recebido confirmação ", JSON.parse(data.content))
                            resolve(JSON.parse(data.content))
                        }
                    })
                }).catch((err) => {
                    return err
                })
            }

            return { sucess: true, token, result: await Return() } as any

        } else {
            return { sucess: false, token, result: "Token invalid" } as any
        }
    }
}