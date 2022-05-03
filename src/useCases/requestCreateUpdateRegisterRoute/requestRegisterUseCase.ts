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
    async CheckFirstQueueConfirmCreateUpdateRegisterBD() {
        const isCreateQueue = await CreateQueue(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string)
        return isCreateQueue
    }

    async Execute({ request, fullName, email, password }: IParams) {

        //checks if queues is created and accessible
        const connectionQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCreateUpdateRegisterBD()
        // const connectionQueueConfirmCreateUpdateRegisterBD = await this.CheckFirstQueueConfirmCreateUpdateRegisterBD()
        if (!connectionQueueCreateUpdateRegisterBD) {
            return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: create_update_register_bd / confirm_create_update_register_bd." }
        }

        const token = request.headers['x-access-token'] as string;
        //validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //validate de inputs
            let validateInputs = RequestRegisterValidatonInpunt({ fullName, email, password })
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result }
            }

            let { firstNameValidate, fullNameValidate, emailValidate, passwordValidate } = validateInputs.result as any
            //centralize the data and send to queue
            let dataJSON = {
                validateToken,
                firstName: firstNameValidate,
                fullName: fullNameValidate,
                email: emailValidate,
                password: passwordValidate,
                comparatorKey: uuidV4()
                //this key is a comparison string. Upon receiving the queue confirmation, 
                //you will compare this key with the one received. If the request key is the same
                // as the one received from the confirmation queue, then it is indeed the request's response
            }

            //send request update/create register to queue
            connectionQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)))

            //after the data is sent to the queue. We will request consumption of the confirmation queue. 
            //Where it will be validated through the comparison key if it is the response of the current request
            //if after 2.5 second don't receive any response, the timeOut will response the request
            async function Busca() {
                return new Promise((resolve, reject) => {
                    async function Buscando() {
                        let dataConsumed: any = new Promise((resolve, reject) => {
                            resolve(ConsumeQueueConfirmCreateUpdateRegisterBD(dataJSON.comparatorKey))
                        })
                        let checkIfReturn = new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve("Internal error. Try again")
                            }, 2500)
                        })
                        let data = await Promise.race([dataConsumed, checkIfReturn])
                        resolve(data)
                    }
                    Buscando()
                })
            }

            return { sucess: true, token, result: await Busca() }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }
}