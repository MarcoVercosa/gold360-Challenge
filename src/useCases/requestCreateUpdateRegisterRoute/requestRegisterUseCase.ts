import { config } from "dotenv"
import { IRequestRegisterRepository } from '../../entities/requestRegisterRoute/IRequestRegisterRepository';
import { IRequestRegisterUseCase, IParams } from '../../entities/requestRegisterRoute/IRequestRegisterUseCase';
import { ValidadeToken } from '../../http/midwares/validateToken';
import { CreateQueue, CreateQueueConfirmRegisterUpdate, ConsumeQueueConfirmCreateUpdateRegisterBD } from '../../manageQueues';

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

    async Execute({ request, response, firstName, fullName, email, password }: IParams) {

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
            //centralize the data and send to queue
            let dataJSON = { validateToken, firstName, fullName, email, password }

            //send request update/create register to queue
            checkFirstQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)), { persistent: true })

            let dataConfirmConsumed: any = await ConsumeQueueConfirmCreateUpdateRegisterBD()
            console.log("dataconsumed")

            if (dataConfirmConsumed.fullName == validateToken.result.fullName) {
                console.log("IFdataConsume")
                response.send({ sucess: true, token, result: dataConfirmConsumed })
                return { sucess: true, token, result: dataConfirmConsumed }

            } else {
                console.log("não caiu no IF")
                return { sucess: true, token, result: dataConfirmConsumed }
            }


        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }

}