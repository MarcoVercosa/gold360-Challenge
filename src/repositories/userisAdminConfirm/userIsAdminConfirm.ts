import { PrismaClient } from '@prisma/client';
import { IUserIsAdminConfirm } from '../../entities/userIsAdminConfirm/IUserIsAdminConfirm';


const prisma = new PrismaClient()

export async function UserIsAdminConfirmRepository({ idToken, fullNameToken }: { idToken: string, fullNameToken: string }): Promise<IUserIsAdminConfirm> {
    let isAdmin: any = await prisma.$queryRaw`SELECT isAdmin from Operators WHERE id = ${idToken} AND fullName = ${fullNameToken}`
    return isAdmin
}
