import { RequestLoginUseCase } from "./requesLoginUseCase"
import { IReturn } from "../../entities/requestLoginRoute/IRequestLoginUseCase"
export class RequestLoginController {

    constructor(
        private requestLoginUseCase: RequestLoginUseCase
    ) { }

    async Handle(request: any, response: any): Promise<{ result: IReturn, codeResult: number }> {
        const { email, password }: any = request.body
        let result: boolean | IReturn = false
        try {
            result = await this.requestLoginUseCase.Execute(email, password) as IReturn
            if (result.sucess) {
                return { result, codeResult: 200 }
            }
            else {
                return { result, codeResult: 401 }
            }
        }
        catch (err: any) {
            return { result: err, codeResult: 500 }
        }
    }

}