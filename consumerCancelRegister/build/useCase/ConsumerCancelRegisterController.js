"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCancelRegisterController = void 0;
const dotenv_1 = require("dotenv");
const createLogs_1 = require("../services/createLogs/createLogs");
(0, dotenv_1.config)();
class ConsumerCancelRegisterController {
    constructor(consumerCancelRegisterUseCase) {
        this.consumerCancelRegisterUseCase = consumerCancelRegisterUseCase;
    }
    async Handle() {
        try {
            await this.consumerCancelRegisterUseCase.ConnectAndConsume();
        }
        catch (error) {
            createLogs_1.Logger.error(`System => - erro: ${JSON.stringify(error)}`);
        }
    }
}
exports.ConsumerCancelRegisterController = ConsumerCancelRegisterController;
//# sourceMappingURL=ConsumerCancelRegisterController.js.map