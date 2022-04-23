import { RequestActiveRegisterRepository } from "../../repositories/requestActiveRegisterRoute/requestActiveRegisterRepository";
import { RequestActiveRegisterUseCase } from "../../useCases/requestActiveRegisterRoute/requestActiveRegisterUseCase"
import { RequestActiveRegisterController } from "../../useCases/requestActiveRegisterRoute/requestActiveRegisterController";

const requestActiveRegisterRepository = new RequestActiveRegisterRepository()
const requestLActiveRegisterUseCase = new RequestActiveRegisterUseCase(requestActiveRegisterRepository)
const requestActiveRegisterController = new RequestActiveRegisterController(requestLActiveRegisterUseCase)

export { requestActiveRegisterController }