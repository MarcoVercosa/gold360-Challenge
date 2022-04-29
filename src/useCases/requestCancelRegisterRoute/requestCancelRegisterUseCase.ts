import { IRequestCancelRegisterRepository } from "../../entities/requestCancelRoute/IRequestCancelRepository";
import { IRequestCancelRegisterUseCase } from "../../entities/requestCancelRoute/IRequestCancelUseCase";
import { ValidadeToken } from "../../http/midwares/validateToken";

export class RequestCancelRegisterUseCase implements IRequestCancelRegisterUseCase {
    constructor(
        private requestCancelRegisterRepository: IRequestCancelRegisterRepository
    ) { }

    async Execute(token: string, id: number, fullName: string) {
        //check validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //agter this check if is admin
            let isAdminRepository: any = await this.requestCancelRegisterRepository.UserIsAdminConfirm(validateToken.result.id, validateToken.result.fullName)

            if (isAdminRepository[0].isAdmin) {
                let result = await this.requestCancelRegisterRepository.RequestCancelRepository(id, fullName)
                return { sucess: true, token, result }
            } else {
                return { sucess: false, token, result: "Administrator permission is required" }
            }
        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }
}