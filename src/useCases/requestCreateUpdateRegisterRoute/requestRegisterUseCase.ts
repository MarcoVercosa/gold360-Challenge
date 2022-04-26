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

    async Execute({ request, firstName, fullName, email, password, isAdmin }: IParams) {
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

            //centralize the data and sendo to queue
            let dataJSON = { validateToken, firstName, fullName, email, password, isAdmin }
            checkFirstQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(dataJSON)))


            //consumer the queue
            checkFirstQueueCreateUpdateRegisterBD.consume(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
                async (data: any) => {
                    const dataConsume = await JSON.parse(data.content.toString())
                    console.log("Data from queue received")
                    console.log(dataConsume)
                    checkFirstQueueCreateUpdateRegisterBD.ack //avisa ao habbitMQ que os dados foram recebidos e tratados e pode ser liberado do fila
                })

            let isAdminRepository: any = await this.requestRegisterRepository.UserIsAdminConfirm(validateToken.result.id, validateToken.result.fullName)

            if (isAdminRepository[0].isAdmin) {
                let result: number = await this.requestRegisterRepository.RequestRegisterRepository({ firstName, fullName, email, password, lastUpDateBy: validateToken.result.fullName })
                return { sucess: true, token, result }
            } else {
                return { sucess: false, token, result: "Administrator permission is required" }
            }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }

}