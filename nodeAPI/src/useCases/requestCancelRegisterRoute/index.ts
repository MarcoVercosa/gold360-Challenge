//import { RequestCancelActiveRegisterRepository } from "../../repositories/requestCancelActiveRegisterRoute/requestCancelActiveRegisterRepository";
import { RequestCancelRegisterUseCase } from "./requestCancelRegisterUseCase"
import { RequestCancelRegisterController } from "./requestCancelRegisterController";

//const requestCancelActiveRegisterRepository = new RequestCancelActiveRegisterRepository()
const requestLCancelRegisterUseCase = new RequestCancelRegisterUseCase()
const requestCancelRegisterController = new RequestCancelRegisterController(requestLCancelRegisterUseCase)

export { requestCancelRegisterController }