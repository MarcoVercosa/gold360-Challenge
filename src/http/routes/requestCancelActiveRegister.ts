import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { requestCancelActiveRegisterController } from '../../useCases/requestCancelActiveRegisterRoute';

interface IReturn {
    result: number | string;
    codeResult: number
}

async function RequestCancelActiveRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/cancelactive', async (request, response) => {

        let { result, codeResult }: IReturn = await requestCancelActiveRegisterController.Handle(request)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestCancelActiveRegister }