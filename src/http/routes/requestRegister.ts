import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { IResult } from '../../entities/requestRegisterRoute/IRequestRegisterController';
import { requestRegisterController } from "../../useCases/requestCreateUpdateRegisterRoute/index"

interface IReturn {
    result: IResult;
    codeResult: number
}

async function RequestRegister(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/register', async (request, response) => {
        console.log("cHEGOU REQUEST NA ROTA /REGISTER")
        let { result, codeResult }: IReturn = await requestRegisterController.Handle(request, response)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}

export { RequestRegister }