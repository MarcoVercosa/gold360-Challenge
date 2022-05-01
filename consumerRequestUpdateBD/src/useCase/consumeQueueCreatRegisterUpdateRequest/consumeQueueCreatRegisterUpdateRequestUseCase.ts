import { Channel } from "amqplib"
import { ICreatRegisterUpdateRequestUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestUseCase"
import { CreateRegisterUpdateRequestRepository } from "../../repository/CreatRegisterUpdateRequestRepository"


export class ConsumeQueueCreatRegisterUpdateRequestUseCase implements ICreatRegisterUpdateRequestUseCase {

    constructor(
        private createRegisterUpdateRequestRepository: CreateRegisterUpdateRequestRepository, //repository bd
    ) { }

    async SendConfirmQueueCreateUpdateBD(conection: Channel, data: any): Promise<any> {
        console.log("Enviado CONFIRMAÇÃO para: " + process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD)
        conection.sendToQueue(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string, Buffer.from(JSON.stringify(data)))
    }

    async Execute(dataQueueConsumed: IParams): Promise<any> {
        console.log(dataQueueConsumed)
        try {
            let isAdmin = await this.createRegisterUpdateRequestRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName })
            if (!isAdmin) { return { sucess: true, comparatorKey: "", message: "Permission denied" } }//cancel if is not admin

            let resultBD: number = await this.createRegisterUpdateRequestRepository.RequestRegisterCreateUpdateRepository({
                firstName: dataQueueConsumed.firstName,
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
                password: dataQueueConsumed.password,
                lastUpDateBy: dataQueueConsumed.fullName
            })
            if (resultBD == 0) {
                console.log({ sucess: true, result: "The Register is NOT MODIFIELD" })
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" }
            }
            if (resultBD == 1) {
                console.log({ sucess: true, result: "Register CREATED successfully" })
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" }
            }
            if (resultBD == 2) {
                console.log({ sucess: true, result: "Register UPDATED successfully" })
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" }
            }
        } catch (err: any) {
            console.log(err)
            return { sucess: true, comparatorKey: "", message: err }
        }
    }
}