import { Channel } from "amqplib";
import { v4 as uuidV4 } from 'uuid';
//import { IRequestCancelActiveRegisterRepository } from "../../entities/requestCancelActiveRoute/IRequestCancelActiveRegisterRepository";
import { IRequestCancelActiveRegisterUseCase, IParams, IInputsValidates, IReturn } from "../../entities/requestCancelActiveRoute/IRequestCancelActiveRegisterUseCase";
import { ValidadeToken } from "../../http/midwares/validateToken";
import { CreateQueue } from "../../utils/createQueuesChannels";
import { RequestCancelActiveValidationInpunt } from "./RequestCancelActiveValidationInpunt"

export class RequestCancelActiveRegisterUseCase implements IRequestCancelActiveRegisterUseCase {
    constructor(
        //private requestCancelActiveRegisterRepository: IRequestCancelActiveRegisterRepository
    ) { }


    async CheckFirstQueueCancelActiveRegisterBD(): Promise<Channel | any> {
        const isCreateQueue = await CreateQueue(process.env.QUEUE_NAME_CANCEL_ACTIVE_REGISTER as string)
        return isCreateQueue
    }

    async Execute({ token, fullName, email, active }: IParams): Promise<{ sucess: boolean, token: string, result: IReturn }> {
        console.log(fullName, email, active)
        //check validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //VALIDATE THE INPUTS
            let validateInputs = RequestCancelActiveValidationInpunt({ fullName, email, active }) as IInputsValidates
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result } as any
            }

            //CENTRALIZE THE DATA AND SEND TO QUEUE
            let { fullNameValidate, emailValidate, activeValidate } = validateInputs.result
            let dataJSON = {
                validateToken,
                fullName: fullNameValidate,
                email: emailValidate,
                active: activeValidate,
                comparatorKey: uuidV4()
                //THIS KEY IS A COMPARISON STRING. UPON RECEIVING THE QUEUE CONFIRMATION, 
                //YOU WILL COMPARE THIS KEY WITH THE ONE RECEIVED. IF THE REQUEST KEY IS THE SAME
                // AS THE ONE RECEIVED FROM THE CONFIRMATION QUEUE, THEN IT IS INDEED THE REQUEST'S RESPONSE
            }
            //checks if queues is created and accessible
            const connectionQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCancelActiveRegisterBD()
            if (!connectionQueueCreateUpdateRegisterBD) {
                return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: create_update_register_bd / confirm_create_update_register_bd." } as any
            }

            //CREATE THE QUEUE TEMPORARY TO RECEIVE DE CONFIRMATION WITH DATAS. WHEN THE DATA CONFIRMATION IS RECEIVED, THE CONNECTION IS CLOSE E THE QUEUE TEMPORARY IS DELETED
            let rpc = await connectionQueueCreateUpdateRegisterBD.assertQueue('', { exclusive: true, durable: false })
            console.log("Create queue RPC temporary -- queue of return confirmation--  wit the name ", rpc)
            connectionQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CANCEL_ACTIVE_REGISTER as string, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue })
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE

            //AFTER THE DATA IS SENT TO THE QUEUE. IN THE RETURN OF THE FUNCTION WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
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