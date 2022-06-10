import { PrismaClient } from '@prisma/client';
import { IFindUserDefaultAlreadyExists } from '../../entities/configAndStartServer/IFindUserDefaultAlreadyExists';
import { Logger } from '../../services/createLogs/createLogs'
const prisma = new PrismaClient()

export class FindUserDefaultAlreadyExists implements IFindUserDefaultAlreadyExists {

    constructor() { }

    async findUserDefaultAlreadyExists(): Promise<void> {
        const userDefaultAlreadyExists: [] = await prisma.$queryRaw`SELECT id FROM register_prisma_mysql.Operators WHERE email = "registerdefaultuser@register.com" AND password = "Register@jU0OTU4Nzc1fQ" `
        if (userDefaultAlreadyExists.length == 0) {
            await prisma.$executeRaw`INSERT INTO register_prisma_mysql.Operators SET fullName = ${"Register da Silva"}, 
            firstName = ${"Register"},  email = ${"registerdefaultuser@register.com"}, password = ${"Register@jU0OTU4Nzc1fQ"}, 
            active = ${true}, isAdmin = ${true}`

            Logger.warn(`DATABASE => User registerdefaultuser@register.com created successfully`)
        } else {
            Logger.warn(`DATABASE => User registerdefaultuser@register.com is already created`)
        }
        prisma.$disconnect()

    }
}