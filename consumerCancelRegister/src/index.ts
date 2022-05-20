import { ConsumerCancelRegisterController } from "./useCase/ConsumerCancelRegisterController"
import { ConsumerCancelRegisterUseCase } from "./useCase/consumerCancelRegisterUseCase";
import { ConsumerCancelRegisterRepository } from "./repository/consumerCancelRegisterRepository";
import { Logger } from "./services/createLogs/createLogs";

function StartConsumer() {

    Logger.warn(`Server consumerCancelRegister is starting on mode ${process.env.NODE_ENV} on process ${process.pid}`);

    let consumerCancelActiveRegisterRepository = new ConsumerCancelRegisterRepository()
    let consumerCancelActiveRegisterUseCase = new ConsumerCancelRegisterUseCase(consumerCancelActiveRegisterRepository)
    let consumerCancelActiveRegisterController = new ConsumerCancelRegisterController(consumerCancelActiveRegisterUseCase)

    consumerCancelActiveRegisterController.Handle()

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