import { IRequestCancelRegisterController, IParams } from "../../entities/requestCancelRegisterRoute/IRequestCancelRegisterController"
import { Logger } from "../../services/createLogs/createLogs";
import { RequestCancelRegisterUseCase } from "./requestCancelRegisterUseCase";


export class RequestCancelRegisterController implements IRequestCancelRegisterController {
    constructor(
        private requestCancelRegisterUseCase: RequestCancelRegisterUseCase
    ) { }

    async Handle(request: any): Promise<{ result: number | string; codeResult: number }> {
        const token = request.headers['x-access-token'] as string;
        const { fullName, email }: IParams = request.body as any
        try {
            let result: any = await this.requestCancelRegisterUseCase.Execute({ token, fullName, email })
            if (result.sucess) {
                return { result, codeResult: 200 }
            }
            else {
                return { result, codeResult: 401 }
            }
        }
        catch (err: any) {
            Logger.error(`HTTP => url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - erro: ${JSON.stringify(err)}`)
            return { result: err, codeResult: 500 }
        }
    }
}