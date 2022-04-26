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

        const token = request.headers['x-access-token'] as string;
        //validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            let isAdminRepository: any = await this.requestRegisterRepository.UserIsAdminConfirm(validateToken.result.id, validateToken.result.fullName)

            if (isAdminRepository[0].isAdmin) {
                let result: number = await this.requestRegisterRepository.RequestRegisterRepository({ firstName, fullName, email, password, isAdmin })
                return { sucess: true, token, result }
            } else {
                return { sucess: false, token, result: "Administrator permission is required" }
            }

        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }

}