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

    async RequestRegisterCreateUpdateRepository({ firstName, fullName, email, password, lastUpDateBy }: IParams) {
        let result = await prisma.$executeRaw`INSERT INTO Registers SET fullName = ${fullName}, 
            firstName = ${firstName},  email = ${email}, password = ${password}, active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}
            ON DUPLICATE KEY UPDATE fullName = ${fullName}, firstName = ${firstName},  email = ${email}, password = ${password}, 
            active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}`
        return result
    }

}