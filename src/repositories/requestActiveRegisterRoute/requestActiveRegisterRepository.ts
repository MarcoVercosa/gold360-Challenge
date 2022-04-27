import { PrismaClient } from '@prisma/client';
import { IRequestActiveRegisterRepository } from '../../entities/requestActiveRegisterRoute/IRequestActiveRegisterRepository';
import { UserIsAdminConfirmRepository } from '../userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class RequestActiveRegisterRepository implements IRequestActiveRegisterRepository {

    async UserIsAdminConfirm(id: number, fullName: string): Promise<boolean> {
        let isAdmin: any = await UserIsAdminConfirmRepository(id, fullName)
        return isAdmin
    }

    async RequestActiveRepository(id: number, fullName: string) {
        let result: number = await prisma.$executeRaw`UPDATE Registers SET canceled = ${false}, active= ${true} WHERE id = ${id} AND fullName = ${fullName}`
        return result
    }

}