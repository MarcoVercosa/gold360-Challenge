import { IRequestCreateUpdateRegisterController, IResult } from "../../entities/requestCreateUpdateRegisterRoute/IRequestRegisterController"
import { FastifyRequest } from 'fastify';
import { RequestCreateUpdateRegisterUseCase } from "./requestCreateUpdateRegisterUseCase"
import { Logger } from "../../services/createLogs/createLogs";


export class RequestCreateUpdateRegisterController implements IRequestCreateUpdateRegisterController {

    constructor(
        private requestRegisterUseCase: RequestCreateUpdateRegisterUseCase
    ) { }

    async Handle(request: FastifyRequest): Promise<{ result: IResult, codeResult: number }> {

        try {
            const { fullName, email, password } = request.body as { fullName: string; email: string; password: string }
            let result: IResult

            const token = request.headers['x-access-token'] as string;
            result = await this.requestRegisterUseCase.Execute({ token, fullName, email, password }) as any
            if (result?.sucess) {
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