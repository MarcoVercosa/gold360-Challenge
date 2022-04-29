import { RequestLoginRepository } from "../../repositories/requestLoginRoute/requestLoginRepository";
import { RequestLoginUseCase } from "./requesLoginUseCase";
import { RequestLoginController } from "./requesLoginController";

const requestLoginRepository = new RequestLoginRepository()
const requestLoginUseCase = new RequestLoginUseCase(requestLoginRepository)
const requestLoginController = new RequestLoginController(requestLoginUseCase)

export { requestLoginController }