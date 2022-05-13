"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestActiveRegisterUseCase = void 0;
const validateToken_1 = require("../../http/midwares/validateToken");
class RequestActiveRegisterUseCase {
    constructor(requestActiveRegisterRepository) {
        this.requestActiveRegisterRepository = requestActiveRegisterRepository;
    }
    async Execute(token, id, fullName) {
        //check validate token
        let validateToken = (0, validateToken_1.ValidadeToken)(token);
        if (validateToken.auth) {
            //agter this check if is admin
            let isAdminRepository = await this.requestActiveRegisterRepository.UserIsAdminConfirm(validateToken.result.id, validateToken.result.fullName);
            if (isAdminRepository[0].isAdmin) {
                let result = await this.requestActiveRegisterRepository.RequestActiveRepository(id, fullName);
                return { sucess: true, token, result };
            }
            else {
                return { sucess: false, token, result: "Administrator permission is required" };
            }
        }
        else {
            return { sucess: false, token, result: "Token invalid" };
        }
    }
}
exports.RequestActiveRegisterUseCase = RequestActiveRegisterUseCase;
//# sourceMappingURL=requestActiveRegisterUseCase.js.map