import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { requestCancelRegisterController } from '../../useCases/requestCancelRegisterRoute';

interface IReturn {
    result: number | string;
    codeResult: number
}

async function RequestCancelRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/cancel', async (request, response) => {

        let { result, codeResult }: IReturn = await requestCancelRegisterController.Handle(request)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestCancelRegister }