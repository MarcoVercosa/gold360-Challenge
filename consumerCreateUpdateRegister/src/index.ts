import { ConsumerCreateUpdateRegisterController } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestController"
import { ConsumerCreateUpdateRegisterUseCase } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumerCreateUpdateRegisterUseCase";
import { ConsumerCreateUpdateRegisterRepository } from "./repository/CreatRegisterUpdateRequestRepository";
import { Logger } from "./services/createLogs/createLogs";

Logger.warn(`Server consumerCreateUpdateRegister is starting on mode ${process.env.NODE_ENV}`);

let createRegisterUpdateRequestRepository = new ConsumerCreateUpdateRegisterRepository()
let consumeQueueCreatRegisterUpdateRequestUseCase = new ConsumerCreateUpdateRegisterUseCase(createRegisterUpdateRequestRepository)
let consumeQueueCreatRegisterUpdateController = new ConsumerCreateUpdateRegisterController(consumeQueueCreatRegisterUpdateRequestUseCase)

consumeQueueCreatRegisterUpdateController.Handle()
