import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Logger } from '../../services/createLogs/createLogs';
import { requestCancelRegisterController } from '../../useCases/requestCancelRegisterRoute';

interface IReturn {
    result: number | string;
    codeResult: number
}

async function RequestCancelRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/cancel', async (request, response) => {
        let { result, codeResult }: IReturn = await requestCancelRegisterController.Handle(request)
        Logger.http(`HTTP =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestCancelRegister }