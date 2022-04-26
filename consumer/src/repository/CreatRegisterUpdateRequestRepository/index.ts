import { PrismaClient } from '@prisma/client';
import { ICreatRegisterUpdateRequestRepository, IParams, IParamsUserIsAdmin } from '../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestRepository';
import { UserIsAdminConfirmRepository } from '../../repository/userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class CreateRegisterUpdateRequestRepository implements ICreatRegisterUpdateRequestRepository {

    async UserIsAdminConfirm(data: IParamsUserIsAdmin): Promise<boolean> {
        let { idToken, fullNameToken } = data
        let isAdmin: any = await UserIsAdminConfirmRepository(idToken, fullNameToken)
        return isAdmin
    }

    async CheckIfRegisterAlreadyExists(email: string, fullName: string) {
        let result: [] = await prisma.$queryRaw`SELECT * from Registers WHERE email =${email} AND fullName = ${fullName}`
        return result
    }

    async RequestRegisterRepository({ firstName, fullName, email, password, lastUpDateBy }: IParams) {
        let result = await prisma.$executeRaw`INSERT INTO Registers SET fullName = ${fullName}, 
        firstName = ${firstName},  email = ${email}, password = ${password}, active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}`
        return result
    }
}