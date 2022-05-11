import { IRequestCreateUpdateRegisterController, IResult } from "../../entities/requestCreateUpdateRegisterRoute/IRequestRegisterController"
import { RequestCreateUpdateRegisterUseCase } from "./requestCreateUpdateRegisterUseCase"


export class RequestCreateUpdateRegisterController implements IRequestCreateUpdateRegisterController {

    constructor(
        private requestRegisterUseCase: RequestCreateUpdateRegisterUseCase
    ) { }

    async Handle(request: any, response: any): Promise<{ result: IResult, codeResult: number }> {

        const { fullName, email, password }: any = request.body
        let result: IResult
        try {
            const token = request.headers['x-access-token'] as string;
            result = await this.requestRegisterUseCase.Execute({ token, fullName, email, password }) as any
            if (result?.sucess) {
                console.log("Enviado reply para cliente")
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