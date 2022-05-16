"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCreateUpdateRegisterController = void 0;
const dotenv_1 = require("dotenv");
const createLogs_1 = require("../../services/createLogs/createLogs");
(0, dotenv_1.config)();
class ConsumerCreateUpdateRegisterController {
    constructor(consumeQueueCreatRegisterUpdateRequestUseCase) {
        this.consumeQueueCreatRegisterUpdateRequestUseCase = consumeQueueCreatRegisterUpdateRequestUseCase;
    }
    async Handle() {
        try {
            await this.consumeQueueCreatRegisterUpdateRequestUseCase.ConnectAndConsume();
        }
        catch (error) {
            createLogs_1.Logger.error(`System => - erro: ${JSON.stringify(error)}`);
        }
    }
}
exports.ConsumerCreateUpdateRegisterController = ConsumerCreateUpdateRegisterController;
//# sourceMappingURL=consumeQueueCreatRegisterUpdateRequestController.js.map