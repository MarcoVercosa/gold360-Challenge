"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoginController = void 0;
const createLogs_1 = require("../../services/createLogs/createLogs");
class RequestLoginController {
    constructor(requestLoginUseCase) {
        this.requestLoginUseCase = requestLoginUseCase;
    }
    async Handle(request) {
        const { email, password } = request.body;
        let result = false;
        try {
            result = await this.requestLoginUseCase.Execute(email, password);
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
exports.RequestLoginController = RequestLoginController;
//# sourceMappingURL=requesLoginController.js.map