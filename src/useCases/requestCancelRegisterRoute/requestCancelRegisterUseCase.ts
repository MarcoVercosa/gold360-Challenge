import { IRequestCancelActiveRegisterRepository } from "../../entities/requestCancelRoute/IRequestCancelActiveRegisterRepository";
import { IRequestCancelActiveRegisterUseCase } from "../../entities/requestCancelRoute/IRequestCancelActiveRegisterUseCase";
import { ValidadeToken } from "../../http/midwares/validateToken";

export class RequestCancelActiveRegisterUseCase implements IRequestCancelActiveRegisterUseCase {
    constructor(
        private requestCancelActiveRegisterRepository: IRequestCancelActiveRegisterRepository
    ) { }

    async Execute(token: string, id: number, fullName: string) {
        //check validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //after this check if is admin
            let isAdminRepository: any = await this.requestCancelActiveRegisterRepository.UserIsAdminConfirm(validateToken.result.id, validateToken.result.fullName)

            if (isAdminRepository[0].isAdmin) {
                let result = await this.requestCancelActiveRegisterRepository.RequestCancelActiveRegisterRepository(id, fullName)
                return { sucess: true, token, result }
            } else {
                return { sucess: false, token, result: "Administrator permission is required" }
            }
        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }
}