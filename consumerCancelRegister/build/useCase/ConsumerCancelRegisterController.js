"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCancelRegisterController = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ConsumerCancelRegisterController {
    constructor(consumerCancelRegisterUseCase) {
        this.consumerCancelRegisterUseCase = consumerCancelRegisterUseCase;
    }
    async Handle() {
        try {
            await this.consumerCancelRegisterUseCase.ConnectAndConsume();
        }
        catch (err) {
            console.log({ result: err, codeResult: 500 });
        }
    }
}
exports.ConsumerCancelRegisterController = ConsumerCancelRegisterController;
//# sourceMappingURL=ConsumerCancelRegisterController.js.map