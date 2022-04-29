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

    constructor(

        private requestRegisterRepository: IRequestRegisterRepository
    ) {

    }

    async CheckFirstQueueCreateUpdateRegisterBD() {
        const isCreateQueue = await CreateQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string)
        return isCreateQueue
    }
    async CheckFirstQueueConfirmCreateUpdateRegisterBD() {
        const isCreateQueue = await CreateQueueConfirmRegisterUpdate()
        return isCreateQueue
    }

    async Execute({ request, fullName, email, password }: IParams) {
        console.log(uuidV4())

        //checks if queues is created and accessible
        const checkFirstQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCreateUpdateRegisterBD()
        const checkFirstQueueConfirmCreateUpdateRegisterBD = await this.CheckFirstQueueConfirmCreateUpdateRegisterBD()
        if (!checkFirstQueueCreateUpdateRegisterBD || !checkFirstQueueConfirmCreateUpdateRegisterBD) {
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
            checkFirstQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)), { persistent: true })
            //after the data is sent to the queue. We will request consumption of the confirmation queue. 
            //Where it will be validated through the comparison key if it is the response of the current request
            let dataConfirmConsumed: any = await ConsumeQueueConfirmCreateUpdateRegisterBD(dataJSON.comparatorKey)
            console.log("dataconsumed")
            console.log(dataConfirmConsumed)

            return { sucess: true, token, result: dataConfirmConsumed }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }

}