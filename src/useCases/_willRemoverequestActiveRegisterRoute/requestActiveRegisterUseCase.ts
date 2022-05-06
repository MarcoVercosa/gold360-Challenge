import { IRequestActiveRegisterRepository } from "../../entities/requestActiveRegisterRoute/IRequestActiveRegisterRepository";
import { IRequestActiveRegisterUseCase } from "../../entities/requestActiveRegisterRoute/IRequestActiveRegisterUseCase";
import { ValidadeToken } from "../../http/midwares/validateToken";

export class RequestActiveRegisterUseCase implements IRequestActiveRegisterUseCase {
    constructor(
        private requestActiveRegisterRepository: IRequestActiveRegisterRepository
    ) { }

    async Execute(token: string, id: number, fullName: string) {
        //check validate token
        let validateToken: any = ValidadeToken(token)

        if (validateToken.auth) {
            //agter this check if is admin
            let isAdminRepository: any = await this.requestActiveRegisterRepository.UserIsAdminConfirm(validateToken.result.id, validateToken.result.fullName)

            if (isAdminRepository[0].isAdmin) {
                let result = await this.requestActiveRegisterRepository.RequestActiveRepository(id, fullName)
                return { sucess: true, token, result }
            } else {
                return { sucess: false, token, result: "Administrator permission is required" }
            }
        } else {
            return { sucess: false, token, result: "Token invalid" }
        }
    }
}