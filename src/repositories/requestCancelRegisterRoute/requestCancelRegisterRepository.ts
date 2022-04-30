import { PrismaClient } from '@prisma/client';
import { IRequestCancelActiveRegisterRepository } from '../../entities/requestCancelRoute/IRequestCancelActiveRegisterRepository';
import { UserIsAdminConfirmRepository } from '../userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class RequestCancelActiveRegisterRepository implements IRequestCancelActiveRegisterRepository {

    async UserIsAdminConfirm(id: number, fullName: string): Promise<boolean> {
        let isAdmin: any = await UserIsAdminConfirmRepository(id, fullName)
        return isAdmin
    }

    async RequestCancelActiveRegisterRepository(id: number, fullName: string) {
        let result: number = await prisma.$executeRaw`UPDATE Registers SET canceled = ${true}, active= ${false} WHERE id = ${id} AND fullName = ${fullName}`
        return result
    }

}