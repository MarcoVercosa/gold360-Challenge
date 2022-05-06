//import { RequestCancelActiveRegisterRepository } from "../../repositories/requestCancelActiveRegisterRoute/requestCancelActiveRegisterRepository";
import { RequestCancelActiveRegisterUseCase } from "./requestCancelActiveRegisterUseCase"
import { RequestCancelActiveRegisterController } from "./requestCancelActiveRegisterController";

//const requestCancelActiveRegisterRepository = new RequestCancelActiveRegisterRepository()
const requestLCancelActiveRegisterUseCase = new RequestCancelActiveRegisterUseCase()
const requestCancelActiveRegisterController = new RequestCancelActiveRegisterController(requestLCancelActiveRegisterUseCase)

export { requestCancelActiveRegisterController }