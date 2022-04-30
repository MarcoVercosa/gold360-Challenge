import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from "uuid"
const prisma = new PrismaClient()

async function PopulateBD(fastify: FastifyInstance): Promise<void> {
    fastify.get('/populate', async (request, response) => {

        for (let i = 0; i < 100000; i++) {
            await prisma.$executeRaw`INSERT INTO Registers SET fullName = ${uuidv4()}, 
            firstName = ${uuidv4()},  email = ${uuidv4() + "@" + "hotmail.com"}, password = ${uuidv4()}, active = ${true}, canceled = ${false}, isAdmin= ${false}`

        }
        // response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result)
        response.code(201).header('Content-Type', 'application/json; charset=utf-8').send({ resut: "finalized" })
    })
}
export { PopulateBD }