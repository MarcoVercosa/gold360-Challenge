import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { requestLoginController } from "../../useCases/requestLoginRoute/index"
import { IReturn } from "../../entities/requestLoginRoute/IRequestLoginUseCase"
import { Logger } from "../../services/createLogs/createLogs"

interface IResult {
    result: IReturn;
    codeResult: number
}

async function RequestLogin(fastify: FastifyInstance): Promise<void> {
    fastify.post('/login', async (request: FastifyRequest, response: FastifyReply) => {
        let { result, codeResult }: IResult = await requestLoginController.Handle(request)
        Logger.http(`HTTP =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`)
        Logger.verbose(`ACCESS =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}
export { RequestLogin }