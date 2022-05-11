"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopulateBD = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
async function PopulateBD(fastify) {
    fastify.get('/populate', async (request, response) => {
        for (let i = 0; i < 100000; i++) {
            await prisma.$executeRaw `INSERT INTO Registers SET fullName = ${(0, uuid_1.v4)()}, 
            firstName = ${(0, uuid_1.v4)()},  email = ${(0, uuid_1.v4)() + "@" + "hotmail.com"}, password = ${(0, uuid_1.v4)()}, active = ${true}, canceled = ${false}, isAdmin= ${false}`;
        }
        // response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
        response.code(201).header('Content-Type', 'application/json; charset=utf-8').send({ resut: "finalized" });
    });
}
exports.PopulateBD = PopulateBD;
//# sourceMappingURL=_willRemovepopulateBD.js.map