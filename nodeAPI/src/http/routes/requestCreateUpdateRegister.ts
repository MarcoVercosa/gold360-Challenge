import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IResult } from '../../entities/requestCreateUpdateRegisterRoute/IRequestRegisterController';
import { requestCreateUpdateRegisterController } from "../../useCases/requestCreateUpdateRegisterRoute/index"
import { Logger } from "../../services/createLogs/createLogs"

interface IReturn {
    result: IResult;
    codeResult: number
}

async function RequestCreateUpdateRegister(fastify: FastifyInstance) {
    fastify.post('/register', async (request: FastifyRequest, response: FastifyReply) => {
        let { result, codeResult }: IReturn = await requestCreateUpdateRegisterController.Handle(request)
        Logger.http(`HTTP => url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestCreateUpdateRegister }