import { ConsumerCancelRegisterController } from "./useCase/ConsumerCancelRegisterController"
import { ConsumerCancelRegisterUseCase } from "./useCase/consumerCancelRegisterUseCase";
import { ConsumerCancelRegisterRepository } from "./repository/consumerCancelRegisterRepository";


let consumerCancelActiveRegisterRepository = new ConsumerCancelRegisterRepository()
let consumerCancelActiveRegisterUseCase = new ConsumerCancelRegisterUseCase(consumerCancelActiveRegisterRepository)
let consumerCancelActiveRegisterController = new ConsumerCancelRegisterController(consumerCancelActiveRegisterUseCase)

consumerCancelActiveRegisterController.Handle()
