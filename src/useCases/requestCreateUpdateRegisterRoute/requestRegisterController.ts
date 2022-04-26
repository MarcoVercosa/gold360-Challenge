import { IRequestRegisterController, IResult } from "../../entities/requestRegisterRoute/IRequestRegisterController"
import { RequestRegisterUseCase } from "./requestRegisterUseCase"





export class RequestRegisterController implements IRequestRegisterController {

    constructor(
        private requestRegisterUseCase: RequestRegisterUseCase
    ) { }



    async Handle(request: any): Promise<{ result: IResult, codeResult: number }> {

        const { firstName, fullName, email, password, isAdmin }: any = request.body
        let result: IResult
        try {
            result = await this.requestRegisterUseCase.Execute({ request, firstName, fullName, email, password, isAdmin }) as IResult
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