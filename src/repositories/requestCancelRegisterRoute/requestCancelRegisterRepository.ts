import { PrismaClient } from '@prisma/client';
import { IRequestCancelRegisterRepository } from '../../entities/requestCancelRoute/IRequestCancelRepository';
import { UserIsAdminConfirmRepository } from '../userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class RequestCancelRegisterRepository implements IRequestCancelRegisterRepository {

    async UserIsAdminConfirm(id: number, fullName: string): Promise<boolean> {
        let isAdmin: any = await UserIsAdminConfirmRepository(id, fullName)
        return isAdmin
    }

    async RequestCancelRepository(id: number, fullName: string) {
        let result: number = await prisma.$executeRaw`UPDATE Registers SET canceled = ${true}, active= ${false} WHERE id = ${id} AND fullName = ${fullName}`
        console.log(result)
        return result
    }

}