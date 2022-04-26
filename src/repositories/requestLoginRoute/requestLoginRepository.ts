import { PrismaClient } from '@prisma/client';
import { IRequestLoginRepository } from '../../entities/requestLoginRoute/IRequestLoginRepository';


export class RequestLoginRepository implements IRequestLoginRepository {

    async RequestLogin(email: string, password: string) {
        const prisma = new PrismaClient()
        let resposta: any = await prisma.$queryRaw`SELECT * from Operators WHERE email = ${email} AND password = ${password} `
        return resposta
    }
}