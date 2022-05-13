"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRegisterRepository = void 0;
const client_1 = require("@prisma/client");
const userIsAdminConfirm_1 = require("../userisAdminConfirm/userIsAdminConfirm");
const prisma = new client_1.PrismaClient();
class RequestRegisterRepository {
    async UserIsAdminConfirm(id, fullName) {
        let isAdmin = await (0, userIsAdminConfirm_1.UserIsAdminConfirmRepository)(id, fullName);
        return isAdmin;
    }
    async RequestRegisterRepository({ firstName, fullName, email, password, lastUpDateBy }) {
        let result = await prisma.$executeRaw `INSERT INTO Registers SET fullName = ${fullName}, 
        firstName = ${firstName},  email = ${email}, password = ${password}, active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}`;
        return result;
    }
}
exports.RequestRegisterRepository = RequestRegisterRepository;
//# sourceMappingURL=requestRegisterRepository.js.map