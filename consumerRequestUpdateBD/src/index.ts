import { ConsumeQueueCreatRegisterUpdateController } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestController";
import { ConsumeQueueCreatRegisterUpdateRequestUseCase } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestUseCase";
import { CreateRegisterUpdateRequestRepository } from "./repository/CreatRegisterUpdateRequestRepository";
import { ConnectAMQPQueueServe } from "./manageQueues";
import { config } from "dotenv"

config()

//function GetConnection

let createRegisterUpdateRequestRepository = new CreateRegisterUpdateRequestRepository()
let consumeQueueCreatRegisterUpdateRequestUseCase = new ConsumeQueueCreatRegisterUpdateRequestUseCase(
    process.env.AMQP_QUEUE_SERVER as string,
    process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
    process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string,
    createRegisterUpdateRequestRepository)
let consumeQueueCreatRegisterUpdateController = new ConsumeQueueCreatRegisterUpdateController(consumeQueueCreatRegisterUpdateRequestUseCase)
//When instance the useCase class the consumer is activated
