"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoginRepository = void 0;
const client_1 = require("@prisma/client");
class RequestLoginRepository {
    async RequestLogin(email, password) {
        const prisma = new client_1.PrismaClient();
        let resposta = await prisma.$queryRaw `SELECT id, fullName, email, lastLogin from Operators WHERE email = ${email} AND password = ${password} `;
        if (resposta.length > 0) {
            await prisma.$executeRaw `UPDATE Operators SET  lastLogin = NOW() -INTERVAL 3 HOUR WHERE email = ${email}`;
        }
        prisma.$disconnect();
        return resposta;
    }
}
exports.RequestLoginRepository = RequestLoginRepository;
//# sourceMappingURL=requestLoginRepository.js.map