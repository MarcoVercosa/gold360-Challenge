import { PrismaClient } from '@prisma/client';
import { IConsumerCancelRegisterRepository, IParams, IParamsUserIsAdmin, IReturnCheckIsActive } from '../entities/IConsumerCancelRegisterRepository';
import { UserIsAdminConfirmRepository } from './userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class ConsumerCancelRegisterRepository implements IConsumerCancelRegisterRepository {

    async UserIsAdminConfirm({ idToken, fullNameToken }: IParamsUserIsAdmin) {
        let isAdmin: any = await UserIsAdminConfirmRepository(idToken, fullNameToken)
        return isAdmin
    }

    async CheckIfIsActiveRepository({ fullName, email }: { fullName: string, email: string }) {
        let checkIsActive = await prisma.$queryRaw`SELECT active FROM Registers WHERE email = ${email} AND fullName = ${fullName}` as Array<{ active: boolean }>
        console.log(checkIsActive)
        return checkIsActive
    }

    async CancelRegisterRepository({ fullName, email }: IParams) {
        let activeregister = await prisma.$executeRaw`UPDATE Registers SET  active= ${false} WHERE email = ${email} AND fullName = ${fullName}`
        return activeregister
    }
}