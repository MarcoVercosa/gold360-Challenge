"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCreateUpdateRegisterController = void 0;
class RequestCreateUpdateRegisterController {
    constructor(requestRegisterUseCase) {
        this.requestRegisterUseCase = requestRegisterUseCase;
    }
    async Handle(request, response) {
        const { fullName, email, password } = request.body;
        let result;
        try {
            const token = request.headers['x-access-token'];
            result = await this.requestRegisterUseCase.Execute({ token, fullName, email, password });
            if (result?.sucess) {
                console.log("Enviado reply para cliente");
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
exports.RequestCreateUpdateRegisterController = RequestCreateUpdateRegisterController;
//# sourceMappingURL=requestCreateUpdateRegisterController.js.map