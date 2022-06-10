import { PrismaClient } from '@prisma/client';
import { IRequestLoginRepository, IReturn } from '../../entities/requestLoginRoute/IRequestLoginRepository';


export class RequestLoginRepository implements IRequestLoginRepository {

    async RequestLogin(email: string, password: string): Promise<IReturn[]> {
        const prisma = new PrismaClient()
        let resposta: any = await prisma.$queryRaw`SELECT id, fullName, email, lastLogin from register_prisma_mysql.Operators WHERE email = ${email} AND password = ${password} `
        if (resposta.length > 0) {
            await prisma.$executeRaw`UPDATE register_prisma_mysql.Operators SET  lastLogin = NOW() -INTERVAL 3 HOUR WHERE email = ${email}`
        }
        prisma.$disconnect()
        return resposta
    }
}