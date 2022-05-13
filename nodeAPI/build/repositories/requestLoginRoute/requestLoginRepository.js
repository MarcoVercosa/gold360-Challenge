"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoginRepository = void 0;
const client_1 = require("@prisma/client");
class RequestLoginRepository {
    async RequestLogin(email, password) {
        const prisma = new client_1.PrismaClient();
        let resposta = await prisma.$queryRaw `SELECT * from Operators WHERE email = ${email} AND password = ${password} `;
        return resposta;
    }
}
exports.RequestLoginRepository = RequestLoginRepository;
//# sourceMappingURL=requestLoginRepository.js.map