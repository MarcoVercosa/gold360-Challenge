import { RequestRegisterUseCase } from "./requestRegisterUseCase"
import { RequestRegisterController } from "./requestRegisterController";

const requestLRegisterUseCase = new RequestRegisterUseCase()
const requestRegisterController = new RequestRegisterController(requestLRegisterUseCase)


export { requestRegisterController }