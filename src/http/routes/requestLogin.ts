import { FastifyInstance } from 'fastify';
import { requestLoginController } from "../../useCases/requestLoginRoute/index"
import { IReturn } from "../../entities/requestLoginRoute/IRequestLoginUseCase"

interface IResult {
    result: IReturn;
    codeResult: number
}

async function RequestLogin(fastify: FastifyInstance): Promise<void> {
    fastify.post('/login', async (request, response) => {
        let { result, codeResult }: IResult = await requestLoginController.Handle(request, response)
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
    })
}
export { RequestLogin }