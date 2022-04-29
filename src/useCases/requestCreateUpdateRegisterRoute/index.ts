import { RequestRegisterRepository } from "../../repositories/requestRegisterRoute/requestRegisterRepository";
import { RequestRegisterUseCase } from "./requestRegisterUseCase"
import { RequestRegisterController } from "./requestRegisterController";


const requestRegisterRepository = new RequestRegisterRepository()
const requestLRegisterUseCase = new RequestRegisterUseCase(requestRegisterRepository)
const requestRegisterController = new RequestRegisterController(requestLRegisterUseCase)


export { requestRegisterController }