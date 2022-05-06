import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { IResult } from '../../entities/requestCreateUpdateRegisterRoute/IRequestRegisterController';
import { requestCreateUpdateRegisterController } from "../../useCases/requestCreateUpdateRegisterRoute/index"

interface IReturn {
    result: IResult;
    codeResult: number
}

async function RequestCreateUpdateRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/register', async (request, response) => {
        let { result, codeResult }: IReturn = await requestCreateUpdateRegisterController.Handle(request, response)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestCreateUpdateRegister }