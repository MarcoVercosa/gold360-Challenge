import { ConsumerCancelActiveRegisterController } from "./useCase/ConsumerCancelActiveRegisterController"
import { ConsumerCancelActiveRegisterUseCase } from "./useCase/consumerCancelActiveRegisterUseCase";
import { ConsumerCancelActiveRegisterRepository } from "./repository/consumerCancelActiveRegisterRepository";


let consumerCancelActiveRegisterRepository = new ConsumerCancelActiveRegisterRepository()
let consumerCancelActiveRegisterUseCase = new ConsumerCancelActiveRegisterUseCase(consumerCancelActiveRegisterRepository)
let consumerCancelActiveRegisterController = new ConsumerCancelActiveRegisterController(consumerCancelActiveRegisterUseCase)

consumerCancelActiveRegisterController.Handle()
