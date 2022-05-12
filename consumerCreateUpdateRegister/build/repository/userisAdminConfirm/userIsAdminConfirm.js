"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIsAdminConfirmRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function UserIsAdminConfirmRepository(id, fullName) {
    let isAdmin = await prisma.$queryRaw `SELECT isAdmin from Operators WHERE id = ${id} AND fullName = ${fullName}`;
    return isAdmin;
}
exports.UserIsAdminConfirmRepository = UserIsAdminConfirmRepository;
//# sourceMappingURL=userIsAdminConfirm.js.map