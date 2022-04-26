import { ConsumeQueueCreatRegisterUpdateController } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestController";
import { ConsumeQueueCreatRegisterUpdateRequestUseCase } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestUseCase";
import { CreateRegisterUpdateRequestRepository } from "./repository/CreatRegisterUpdateRequestRepository";
import { config } from "dotenv"

config()

let createRegisterUpdateRequestRepository = new CreateRegisterUpdateRequestRepository()
let consumeQueueCreatRegisterUpdateRequestUseCase = new ConsumeQueueCreatRegisterUpdateRequestUseCase(process.env.AMQP_QUEUE_SERVER as string, process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string, createRegisterUpdateRequestRepository)
let consumeQueueCreatRegisterUpdateController = new ConsumeQueueCreatRegisterUpdateController(consumeQueueCreatRegisterUpdateRequestUseCase)


consumeQueueCreatRegisterUpdateController.Handle()

console.log(consumeQueueCreatRegisterUpdateController)