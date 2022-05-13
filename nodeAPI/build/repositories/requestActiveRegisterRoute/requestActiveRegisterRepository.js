"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestActiveRegisterRepository = void 0;
const client_1 = require("@prisma/client");
const userIsAdminConfirm_1 = require("../userisAdminConfirm/userIsAdminConfirm");
const prisma = new client_1.PrismaClient();
class RequestActiveRegisterRepository {
    async UserIsAdminConfirm(id, fullName) {
        let isAdmin = await (0, userIsAdminConfirm_1.UserIsAdminConfirmRepository)(id, fullName);
        return isAdmin;
    }
    async RequestActiveRepository(id, fullName) {
        let result = await prisma.$executeRaw `UPDATE Registers SET canceled = ${false}, active= ${true} WHERE id = ${id} AND fullName = ${fullName}`;
        return result;
    }
}
exports.RequestActiveRegisterRepository = RequestActiveRegisterRepository;
//# sourceMappingURL=requestActiveRegisterRepository.js.map