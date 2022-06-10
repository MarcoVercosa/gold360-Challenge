import { RequestCreateUpdateRegisterUseCase } from "./requestCreateUpdateRegisterUseCase"
import { RequestCreateUpdateRegisterController } from "./requestCreateUpdateRegisterController";

const requestLCreateUpdateRegisterUseCase = new RequestCreateUpdateRegisterUseCase()
const requestCreateUpdateRegisterController = new RequestCreateUpdateRegisterController(requestLCreateUpdateRegisterUseCase)


export { requestCreateUpdateRegisterController }