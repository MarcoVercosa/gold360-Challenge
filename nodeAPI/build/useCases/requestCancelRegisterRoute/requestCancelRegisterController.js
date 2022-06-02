"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelRegisterController = void 0;
const createLogs_1 = require("../../services/createLogs/createLogs");
class RequestCancelRegisterController {
    constructor(requestCancelRegisterUseCase) {
        this.requestCancelRegisterUseCase = requestCancelRegisterUseCase;
    }
    async Handle(request) {
        const token = request.headers['x-access-token'];
        const { fullName, email } = request.body;
        try {
            let result = await this.requestCancelRegisterUseCase.Execute({ token, fullName, email });
            if (result.sucess) {
                return { result, codeResult: 200 };
            }
            else {
                return { result, codeResult: 401 };
            }
        }
        catch (err) {
            createLogs_1.Logger.error(`HTTP => url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - erro: ${JSON.stringify(err)}`);
            return { result: err, codeResult: 500 };
        }
    }
}
exports.RequestCancelRegisterController = RequestCancelRegisterController;
//# sourceMappingURL=requestCancelRegisterController.js.map