"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCancelRegisterRepository = void 0;
const client_1 = require("@prisma/client");
const userIsAdminConfirm_1 = require("./userisAdminConfirm/userIsAdminConfirm");
const prisma = new client_1.PrismaClient();
class ConsumerCancelRegisterRepository {
    async UserIsAdminConfirm({ idToken, fullNameToken }) {
        let isAdmin = await (0, userIsAdminConfirm_1.UserIsAdminConfirmRepository)(idToken, fullNameToken);
        return isAdmin;
    }
    async CheckIfIsActiveRepository({ fullName, email }) {
        let checkIsActive = await prisma.$queryRaw `SELECT active FROM Registers WHERE email = ${email} AND fullName = ${fullName}`;
        console.log(checkIsActive);
        return checkIsActive;
    }
    async CancelRegisterRepository({ fullName, email }) {
        let activeregister = await prisma.$executeRaw `UPDATE Registers SET  active= ${false} WHERE email = ${email} AND fullName = ${fullName}`;
        return activeregister;
    }
}
exports.ConsumerCancelRegisterRepository = ConsumerCancelRegisterRepository;
//# sourceMappingURL=consumerCancelRegisterRepository.js.map