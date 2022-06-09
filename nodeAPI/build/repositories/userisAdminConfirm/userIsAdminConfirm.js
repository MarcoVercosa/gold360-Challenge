"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIsAdminConfirmRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function UserIsAdminConfirmRepository({ idToken, fullNameToken }) {
    let isAdmin = await prisma.$queryRaw `SELECT isAdmin from Operators WHERE id = ${idToken} AND fullName = ${fullNameToken}`;
    prisma.$disconnect();
    return isAdmin;
}
exports.UserIsAdminConfirmRepository = UserIsAdminConfirmRepository;
//# sourceMappingURL=userIsAdminConfirm.js.map