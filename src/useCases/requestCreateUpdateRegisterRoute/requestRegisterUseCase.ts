import { Channel } from "amqplib";
import { config } from "dotenv"
import { v4 as uuidV4 } from 'uuid';
import { IRequestRegisterRepository } from '../../entities/requestRegisterRoute/IRequestRegisterRepository';
import { IRequestRegisterUseCase, IParams } from '../../entities/requestRegisterRoute/IRequestRegisterUseCase';
import { ValidadeToken } from '../../http/midwares/validateToken';
import { CreateQueue, CreateQueueConfirmRegisterUpdate, ConsumeQueueConfirmCreateUpdateRegisterBD } from '../../manageQueues';
import { RequestRegisterValidatonInpunt } from "./requestRegisterValidatonInpunt"


config()
export class RequestRegisterUseCase implements IRequestRegisterUseCase {

    dataQueueConfirmConsumed: any

    constructor() { }

    async CheckFirstQueueCreateUpdateRegisterBD(): Promise<Channel | any> {
        const isCreateQueue = await CreateQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string)
        return isCreateQueue
    }

    async Execute({ request, fullName, email, password }: IParams) {

        //checks if queues is created and accessible
        const connectionQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCreateUpdateRegisterBD()
        if (!connectionQueueCreateUpdateRegisterBD) {
            return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: create_update_register_bd / confirm_create_update_register_bd." }
        }

        const token = request.headers['x-access-token'] as string;
        //VALIDATE TOKEN
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //VALIDATE DE INPUTS
            let validateInputs = RequestRegisterValidatonInpunt({ fullName, email, password })
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result }
            }

            let { firstNameValidate, fullNameValidate, emailValidate, passwordValidate } = validateInputs.result as any
            //CENTRALIZE THE DATA AND SEND TO QUEUE
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

            //CREATE THE QUEUE TEMPORARY TO RECEIVE DE CONFIRMATION WITH DATAS
            let rpc = await connectionQueueCreateUpdateRegisterBD.assertQueue('', { exclusive: true })
            console.log("Create queue RPC temporary -- queue of return confirmation--  wit the name ", rpc)
            connectionQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue })
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE

            //AFTER THE DATA IS SENT TO THE QUEUE. WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
            //WHERE IT WILL BE VALIDATED THROUGH THE COMPARISON KEY IF IT IS THE RESPONSE OF THE CURRENT REQUEST

            async function Retorno() {
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

            return { sucess: true, token, result: await Retorno() }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }
}