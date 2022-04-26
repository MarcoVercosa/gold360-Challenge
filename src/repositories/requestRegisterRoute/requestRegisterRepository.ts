import { PrismaClient } from '@prisma/client';
import { IRequestRegisterRepository, IParams } from '../../entities/requestRegisterRoute/IRequestRegisterRepository';
import { UserIsAdminConfirmRepository } from '../userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class RequestRegisterRepository implements IRequestRegisterRepository {

    async UserIsAdminConfirm(id: number, fullName: string): Promise<boolean> {
        console.log(id, fullName)
        let isAdmin: any = await UserIsAdminConfirmRepository(id, fullName)
        return isAdmin
    }

    async RequestRegisterRepository({ firstName, fullName, email, password, lastUpDateBy }: IParams) {
        let result = await prisma.$executeRaw`INSERT INTO Registers SET fullName = ${fullName}, 
        firstName = ${firstName},  email = ${email}, password = ${password}, active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}`
        return result
    }
}