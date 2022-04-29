import { PrismaClient } from '@prisma/client';
import { ICreatRegisterUpdateRequestRepository, IParams, IParamsUserIsAdmin } from '../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestRepository';
import { UserIsAdminConfirmRepository } from '../userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class CreateRegisterUpdateRequestRepository implements ICreatRegisterUpdateRequestRepository {

    async UserIsAdminConfirm(data: IParamsUserIsAdmin): Promise<boolean> {
        let { idToken, fullNameToken } = data
        let isAdmin: any = await UserIsAdminConfirmRepository(idToken, fullNameToken)
        return isAdmin
    }

    //https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
    //1 the affected-rows value per row is 1 if the row is inserted as a new row, 
    //2 if an existing row is updated, 
    //and 0 if an existing row is set to its current values.

    async RequestRegisterCreateUpdateRepository({ firstName, fullName, email, password, lastUpDateBy }: IParams) {
        let result = await prisma.$executeRaw`INSERT INTO Registers SET fullName = ${fullName}, 
            firstName = ${firstName},  email = ${email}, password = ${password}, active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}
            ON DUPLICATE KEY UPDATE fullName = ${fullName}, firstName = ${firstName},  email = ${email}, password = ${password}, 
            active = ${true}, canceled = ${false}, lastUpDateBy = ${lastUpDateBy}`
        return result
    }

}