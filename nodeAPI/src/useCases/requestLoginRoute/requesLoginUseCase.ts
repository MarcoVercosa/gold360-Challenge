import { IRequestLoginRepository } from "../../entities/requestLoginRoute/IRequestLoginRepository";
import { IRequestLoginUseCase, IReturn } from "../../entities/requestLoginRoute/IRequestLoginUseCase";
import { GenerateToken } from "../../http/midwares/generateToken";

export class RequestLoginUseCase implements IRequestLoginUseCase {

    constructor(
        private requestLoginRepository: IRequestLoginRepository
    ) { }

    async Execute(email: string, password: string): Promise<IReturn> {
        let result = await this.requestLoginRepository.RequestLogin(email, password)
        if (result.length > 0) {
            const token = GenerateToken(result[0].id, result[0].fullName)
            return { sucess: true, token, result } as unknown as IReturn

        } else {
            return { sucess: false, token: "", result: "User or password is incorrect" }
        }
    }

}