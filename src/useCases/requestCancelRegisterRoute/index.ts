import { RequestCancelRegisterRepository } from "../../repositories/requestCancelRegisterRoute/requestCancelRegisterRepository";
import { RequestCancelRegisterUseCase } from "../../useCases/requestCancelRegisterRoute/requestCancelRegisterUseCase"
import { RequestCancelRegisterController } from "../../useCases/requestCancelRegisterRoute/requestCancelRegisterController";

const requestCancelRegisterRepository = new RequestCancelRegisterRepository()
const requestLCancelRegisterUseCase = new RequestCancelRegisterUseCase(requestCancelRegisterRepository)
const requestCancelRegisterController = new RequestCancelRegisterController(requestLCancelRegisterUseCase)

export { requestCancelRegisterController }