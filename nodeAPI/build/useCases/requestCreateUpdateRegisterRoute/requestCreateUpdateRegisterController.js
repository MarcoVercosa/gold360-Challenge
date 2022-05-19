"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCreateUpdateRegisterController = void 0;
const createLogs_1 = require("../../services/createLogs/createLogs");
class RequestCreateUpdateRegisterController {
    constructor(requestRegisterUseCase) {
        this.requestRegisterUseCase = requestRegisterUseCase;
    }
    async Handle(request) {
        const { fullName, email, password } = request.body;
        let result;
        try {
            const token = request.headers['x-access-token'];
            result = await this.requestRegisterUseCase.Execute({ token, fullName, email, password });
            if (result?.sucess) {
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
exports.RequestCreateUpdateRegisterController = RequestCreateUpdateRegisterController;
//# sourceMappingURL=requestCreateUpdateRegisterController.js.map