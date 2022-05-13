"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestActiveRegisterController = void 0;
class RequestActiveRegisterController {
    constructor(requestActiveRegisterUseCase) {
        this.requestActiveRegisterUseCase = requestActiveRegisterUseCase;
    }
    async Handle(request) {
        const token = request.headers['x-access-token'];
        const { id, fullName } = request.body;
        try {
            let result = await this.requestActiveRegisterUseCase.Execute(token, id, fullName);
            if (result.sucess) {
                return { result, codeResult: 200 };
            }
            else {
                return { result, codeResult: 401 };
            }
        }
        catch (err) {
            return { result: err, codeResult: 500 };
        }
    }
}
exports.RequestActiveRegisterController = RequestActiveRegisterController;
//# sourceMappingURL=requestActiveRegisterController.js.map