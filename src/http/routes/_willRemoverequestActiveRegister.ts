import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { requestActiveRegisterController } from '../../useCases/_willRemoverequestActiveRegisterRoute';

interface IReturn {
    result: number | string;
    codeResult: number
}

async function RequestActiveRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/active', async (request, response) => {

        let { result, codeResult }: IReturn = await requestActiveRegisterController.Handle(request)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestActiveRegister }