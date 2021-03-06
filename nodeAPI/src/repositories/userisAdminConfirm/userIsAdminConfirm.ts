import { PrismaClient } from '@prisma/client';
import { IUserIsAdminConfirm } from '../../entities/userIsAdminConfirm/IUserIsAdminConfirm';


const prisma = new PrismaClient()

export async function UserIsAdminConfirmRepository({ idToken, fullNameToken }: { idToken: string, fullNameToken: string }): Promise<IUserIsAdminConfirm> {
    let isAdmin: any = await prisma.$queryRaw`SELECT isAdmin from register_prisma_mysql.Operators WHERE id = ${idToken} AND fullName = ${fullNameToken}`
    prisma.$disconnect()
    return isAdmin
}
