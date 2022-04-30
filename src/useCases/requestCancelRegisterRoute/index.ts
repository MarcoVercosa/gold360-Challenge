import { RequestCancelActiveRegisterRepository } from "../../repositories/requestCancelRegisterRoute/requestCancelRegisterRepository";
import { RequestCancelActiveRegisterUseCase } from "../../useCases/requestCancelRegisterRoute/requestCancelRegisterUseCase"
import { RequestCancelActiveRegisterController } from "../../useCases/requestCancelRegisterRoute/requestCancelRegisterController";

const requestCancelRegisterRepository = new RequestCancelActiveRegisterRepository()
const requestLCancelRegisterUseCase = new RequestCancelActiveRegisterUseCase(requestCancelRegisterRepository)
const requestCancelRegisterController = new RequestCancelActiveRegisterController(requestLCancelRegisterUseCase)

export { requestCancelRegisterController }