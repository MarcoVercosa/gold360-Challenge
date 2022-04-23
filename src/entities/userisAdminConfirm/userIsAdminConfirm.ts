import { PrismaClient } from '@prisma/client';
import { IUserIsAdminConfirm } from '../userIsAdminConfirm/IUserIsAdminConfirm';


const prisma = new PrismaClient()

export async function UserIsAdminConfirmRepository(id: number, fullName: string): Promise<IUserIsAdminConfirm> {
    let isAdmin: any = await prisma.$queryRaw`SELECT isAdmin from Registers WHERE id = ${id} AND fullName = ${fullName}`
    return isAdmin
}
