import { RequestLoginUseCase } from "./requesLoginUseCase"
import { FastifyRequest } from 'fastify';
import { Logger } from "../../services/createLogs/createLogs"
import { IRequestLoginController, IReturn } from "../../entities/requestLoginRoute/IRequestLoginController"


export class RequestLoginController implements IRequestLoginController {

    constructor(
        private requestLoginUseCase: RequestLoginUseCase
    ) { }

    async Handle(request: FastifyRequest): Promise<{ result: IReturn, codeResult: number }> {
        const { email, password }: any = request.body
        console.log(email, password)
        console.log("email, password")
        console.log("email, password")
        console.log("email, password")
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
            Logger.error(`HTTP => url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - erro: ${JSON.stringify(err)}`)
            return { result: err, codeResult: 500 }
        }
    }

}