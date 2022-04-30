import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { requestCancelRegisterController } from '../../useCases/requestCancelRegisterRoute';

interface IReturn {
    result: number | string;
    codeResult: number
}

async function RequestCancelActiveRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/cancelactive', async (request, response) => {

        let { result, codeResult }: IReturn = await requestCancelRegisterController.Handle(request)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestCancelActiveRegister }