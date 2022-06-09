import { ConsumerCreateUpdateRegisterController } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestController"
import { ConsumerCreateUpdateRegisterUseCase } from "./useCase/consumeQueueCreatRegisterUpdateRequest/consumerCreateUpdateRegisterUseCase";
import { ConsumerCreateUpdateRegisterRepository } from "./repository/CreatRegisterUpdateRequestRepository";
import { Logger } from "./services/createLogs/createLogs";

function StartConsumer() {

    Logger.warn(`Server consumerCreateUpdateRegister is starting on mode "" ${process.env.NODE_ENV} "" on process ${process.pid}`);

    let createRegisterUpdateRequestRepository = new ConsumerCreateUpdateRegisterRepository()
    let consumeQueueCreatRegisterUpdateRequestUseCase = new ConsumerCreateUpdateRegisterUseCase(createRegisterUpdateRequestRepository)
    let consumeQueueCreatRegisterUpdateController = new ConsumerCreateUpdateRegisterController(consumeQueueCreatRegisterUpdateRequestUseCase)

    consumeQueueCreatRegisterUpdateController.Handle()

    process.on("SIGTERM", () => {
        Logger.error(`ERROR => SIGTERM, the ${process.pid} is kill. Restarting aplication again`)
        process.exit(1)
    })
    process.on("SIGINT", () => {
        Logger.error(`ERROR => SIGINT, the ${process.pid} is kill. Restarting aplication again.`)
        process.exit(1)
    })
}
export { StartConsumer }
