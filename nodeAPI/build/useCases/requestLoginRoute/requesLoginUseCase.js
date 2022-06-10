"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoginUseCase = void 0;
const generateToken_1 = require("../../http/midwares/generateToken");
class RequestLoginUseCase {
    constructor(requestLoginRepository) {
        this.requestLoginRepository = requestLoginRepository;
    }
    async Execute(email, password) {
        let result = await this.requestLoginRepository.RequestLogin(email, password);
        if (result.length > 0) {
            const token = (0, generateToken_1.GenerateToken)(result[0].id, result[0].fullName);
            return { sucess: true, token, result };
        }
        else {
            return { sucess: false, token: "", result: "User or password is incorrect" };
        }
    }
}
exports.RequestLoginUseCase = RequestLoginUseCase;
//# sourceMappingURL=requesLoginUseCase.js.map