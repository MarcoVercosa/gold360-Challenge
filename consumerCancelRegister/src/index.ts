import { ConsumerCancelRegisterController } from "./useCase/ConsumerCancelRegisterController"
import { ConsumerCancelRegisterUseCase } from "./useCase/consumerCancelRegisterUseCase";
import { ConsumerCancelRegisterRepository } from "./repository/consumerCancelRegisterRepository";
import { Logger } from "./services/createLogs/createLogs";

Logger.warn(`Server consumerCancelRegister is starting on mode ${process.env.NODE_ENV}`);

let consumerCancelActiveRegisterRepository = new ConsumerCancelRegisterRepository()
let consumerCancelActiveRegisterUseCase = new ConsumerCancelRegisterUseCase(consumerCancelActiveRegisterRepository)
let consumerCancelActiveRegisterController = new ConsumerCancelRegisterController(consumerCancelActiveRegisterUseCase)

consumerCancelActiveRegisterController.Handle()
