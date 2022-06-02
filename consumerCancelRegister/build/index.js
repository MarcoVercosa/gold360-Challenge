"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartConsumer = void 0;
const ConsumerCancelRegisterController_1 = require("./useCase/ConsumerCancelRegisterController");
const consumerCancelRegisterUseCase_1 = require("./useCase/consumerCancelRegisterUseCase");
const consumerCancelRegisterRepository_1 = require("./repository/consumerCancelRegisterRepository");
const createLogs_1 = require("./services/createLogs/createLogs");
function StartConsumer() {
    createLogs_1.Logger.warn(`Server consumerCancelRegister is starting on mode "" ${process.env.NODE_ENV} "" on process ${process.pid} ""`);
    let consumerCancelActiveRegisterRepository = new consumerCancelRegisterRepository_1.ConsumerCancelRegisterRepository();
    let consumerCancelActiveRegisterUseCase = new consumerCancelRegisterUseCase_1.ConsumerCancelRegisterUseCase(consumerCancelActiveRegisterRepository);
    let consumerCancelActiveRegisterController = new ConsumerCancelRegisterController_1.ConsumerCancelRegisterController(consumerCancelActiveRegisterUseCase);
    consumerCancelActiveRegisterController.Handle();
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