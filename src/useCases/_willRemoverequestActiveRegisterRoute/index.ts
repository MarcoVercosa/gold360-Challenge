import { RequestActiveRegisterRepository } from "../../repositories/requestActiveRegisterRoute/requestActiveRegisterRepository";
import { RequestActiveRegisterUseCase } from "./requestActiveRegisterUseCase"
import { RequestActiveRegisterController } from "./requestActiveRegisterController";

const requestActiveRegisterRepository = new RequestActiveRegisterRepository()
const requestLActiveRegisterUseCase = new RequestActiveRegisterUseCase(requestActiveRegisterRepository)
const requestActiveRegisterController = new RequestActiveRegisterController(requestLActiveRegisterUseCase)

export { requestActiveRegisterController }