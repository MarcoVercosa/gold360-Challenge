import { config } from "dotenv"
import { IRequestRegisterRepository } from '../../entities/requestRegisterRoute/IRequestRegisterRepository';
import { IRequestRegisterUseCase, IParams } from '../../entities/requestRegisterRoute/IRequestRegisterUseCase';
import { ValidadeToken } from '../../http/midwares/validateToken';
import { CreateQueueRegisterUpdate, CreateQueueConfirmRegisterUpdate, ConsumeQueueConfirmCreateUpdateRegisterBD } from '../../manageQueues';

export class RequestRegisterUseCase implements IRequestRegisterUseCase {

    constructor(
        private requestRegisterRepository: IRequestRegisterRepository
    ) { }


    async CheckFirstQueueCreateUpdateRegisterBD() {
        const isCreateQueue = await CreateQueueRegisterUpdate()
        return isCreateQueue
    }
    async CheckFirstQueueConfirmCreateUpdateRegisterBD() {
        const isCreateQueue = await CreateQueueConfirmRegisterUpdate()
        return isCreateQueue
    }

    async Execute({ request, response, firstName, fullName, email, password }: IParams) {
        config()
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
            //persistent:true = Use disk to store data when memory is very high
            let dataConfirmConsumed: any

            // await checkFirstQueueConfirmCreateUpdateRegisterBD.consume(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string, async (data: any) => {
            //     console.log("escutando queueConfirm")
            //     let dataConsume: any = await JSON.parse(data.content)///change from  buffer to object  
            //     if (dataConsume.fullName == validateToken.result.fullName) {
            //         console.log("dataConsume")
            //         console.log(dataConsume.message)
            //         dataConfirmConsumed = await dataConsume.message

            //     }

            // })
            let dataconsumed = await ConsumeQueueConfirmCreateUpdateRegisterBD(checkFirstQueueConfirmCreateUpdateRegisterBD)
            console.log("dataconsumed")
            console.log(await dataconsumed)


            return { sucess: true, token, result: await dataconsumed }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }

}