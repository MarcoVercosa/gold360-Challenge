import { config } from "dotenv"
import { IRequestRegisterRepository } from '../../entities/requestRegisterRoute/IRequestRegisterRepository';
import { IRequestRegisterUseCase, IParams } from '../../entities/requestRegisterRoute/IRequestRegisterUseCase';
import { ValidadeToken } from '../../http/midwares/validateToken';
import { CreateQueueRegisterUpdate } from '../../queues/queueRegisterUpdate';

export class RequestRegisterUseCase implements IRequestRegisterUseCase {

    constructor(
        private requestRegisterRepository: IRequestRegisterRepository
    ) { }


    async CheckFirstQueueCreateUpdateRegisterBD() {
        const isCreateQueue = await CreateQueueRegisterUpdate()
        return isCreateQueue
    }

    async Execute({ request, response, firstName, fullName, email, password, isAdmin }: IParams) {
        config()
        //checks if queue is created and accessible
        const checkFirstQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCreateUpdateRegisterBD()
        if (!checkFirstQueueCreateUpdateRegisterBD) {
            return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: create_update_register_bd." }
        }

        const token = request.headers['x-access-token'] as string;

        //validate token
        let validateToken: any = ValidadeToken(token)


        if (validateToken.auth) {

            //centralize the data and send to queue
            let dataJSON = { response, validateToken, firstName, fullName, email, password, isAdmin }

            checkFirstQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)), { persistent: true })
            //persistent:true = Use disk to store data when memory is very high

            return { sucess: true, token, result: "Send to queue" }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }

}