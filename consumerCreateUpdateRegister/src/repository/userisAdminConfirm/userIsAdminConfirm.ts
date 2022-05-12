import { PrismaClient } from '@prisma/client';
import { IUserIsAdminConfirm } from '../../entities/userIsAdminConfirm/IUserAdminIsConfirm';


const prisma = new PrismaClient()

export async function UserIsAdminConfirmRepository(id: number, fullName: string): Promise<IUserIsAdminConfirm> {
    let isAdmin: any = await prisma.$queryRaw`SELECT isAdmin from Operators WHERE id = ${id} AND fullName = ${fullName}`
    return isAdmin
}
