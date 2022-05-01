import { RequestCancelActiveRegisterRepository } from "../../repositories/requestCancelRegisterRoute/requestCancelRegisterRepository";
import { RequestCancelActiveRegisterUseCase } from "./requestCancelActiveRegisterUseCase"
import { RequestCancelActiveRegisterController } from "./requestCancelActiveRegisterController";

const requestCancelRegisterRepository = new RequestCancelActiveRegisterRepository()
const requestLCancelRegisterUseCase = new RequestCancelActiveRegisterUseCase(requestCancelRegisterRepository)
const requestCancelRegisterController = new RequestCancelActiveRegisterController(requestLCancelRegisterUseCase)

export { requestCancelRegisterController }