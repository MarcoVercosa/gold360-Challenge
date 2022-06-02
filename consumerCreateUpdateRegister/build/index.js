"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartConsumer = void 0;
const consumeQueueCreatRegisterUpdateRequestController_1 = require("./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestController");
const consumerCreateUpdateRegisterUseCase_1 = require("./useCase/consumeQueueCreatRegisterUpdateRequest/consumerCreateUpdateRegisterUseCase");
const CreatRegisterUpdateRequestRepository_1 = require("./repository/CreatRegisterUpdateRequestRepository");
const createLogs_1 = require("./services/createLogs/createLogs");
function StartConsumer() {
    createLogs_1.Logger.warn(`Server consumerCreateUpdateRegister is starting on mode "" ${process.env.NODE_ENV} "" on process ${process.pid}`);
    let createRegisterUpdateRequestRepository = new CreatRegisterUpdateRequestRepository_1.ConsumerCreateUpdateRegisterRepository();
    let consumeQueueCreatRegisterUpdateRequestUseCase = new consumerCreateUpdateRegisterUseCase_1.ConsumerCreateUpdateRegisterUseCase(createRegisterUpdateRequestRepository);
    let consumeQueueCreatRegisterUpdateController = new consumeQueueCreatRegisterUpdateRequestController_1.ConsumerCreateUpdateRegisterController(consumeQueueCreatRegisterUpdateRequestUseCase);
    consumeQueueCreatRegisterUpdateController.Handle();
    process.on("SIGTERM", () => {
        createLogs_1.Logger.error(`ERROR => SIGTERM, the ${process.pid} is kill. Restarting aplication again`);
        process.exit(1);
    });
    process.on("SIGINT", () => {
        createLogs_1.Logger.error(`ERROR => SIGINT, the ${process.pid} is kill. Restarting aplication again.`);
        process.exit(1);
    });
}
exports.StartConsumer = StartConsumer;
//# sourceMappingURL=index.js.map