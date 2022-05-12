"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCreateUpdateRegisterController = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ConsumerCreateUpdateRegisterController {
    constructor(consumeQueueCreatRegisterUpdateRequestUseCase) {
        this.consumeQueueCreatRegisterUpdateRequestUseCase = consumeQueueCreatRegisterUpdateRequestUseCase;
    }
    async Handle() {
        try {
            await this.consumeQueueCreatRegisterUpdateRequestUseCase.ConnectAndConsume();
        }
        catch (err) {
            console.log({ result: err, codeResult: 500 });
        }
    }
}
exports.ConsumerCreateUpdateRegisterController = ConsumerCreateUpdateRegisterController;
//# sourceMappingURL=consumeQueueCreatRegisterUpdateRequestController.js.map