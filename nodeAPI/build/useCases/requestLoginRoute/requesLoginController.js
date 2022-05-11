"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoginController = void 0;
class RequestLoginController {
    constructor(requestLoginUseCase) {
        this.requestLoginUseCase = requestLoginUseCase;
    }
    async Handle(request, response) {
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
            return { result: err, codeResult: 500 };
        }
    }
}
exports.RequestLoginController = RequestLoginController;
//# sourceMappingURL=requesLoginController.js.map