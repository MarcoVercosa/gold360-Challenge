import { PrismaClient } from '@prisma/client';
import { IConsumerCancelActiveRegisterRepository, IParams, IParamsUserIsAdmin, IReturnCheckIsActive } from '../entities/IConsumerCancelActiveRegisterRepository';
import { UserIsAdminConfirmRepository } from './userisAdminConfirm/userIsAdminConfirm';

const prisma = new PrismaClient()

export class ConsumerCancelActiveRegisterRepository implements IConsumerCancelActiveRegisterRepository {

    async UserIsAdminConfirm({ idToken, fullNameToken }: IParamsUserIsAdmin) {

        let isAdmin: any = await UserIsAdminConfirmRepository(idToken, fullNameToken)
        return isAdmin
    }

    async CancelActiveRegisterRepository({ fullName, email, active }: IParams) {

        //if the request is to active resgister
        if (active) {
            //check BD if register is active 
            let checkIsActive = await prisma.$queryRaw`SELECT * FROM Registers WHERE email = ${email} AND fullName = ${fullName}` as IReturnCheckIsActive[]
            if (checkIsActive[0].active) {
                //retornar que o usuário ja está ativo e não houve alteração no banco de dados
            }
            if (!checkIsActive[0].active) {//If register is NOT active
                await prisma.$executeRaw`UPDATE Registers SET  active= ${true} WHERE email = ${email} AND fullName = ${fullName}`
                //retornar que o usuário foi ativado com sucesso no banco e dados
            }
        } else {
            let checkIsActive = await prisma.$queryRaw`SELECT * FROM Registers WHERE email = ${email} AND fullName = ${fullName}` as IReturnCheckIsActive[]
            if (!checkIsActive[0].active) { // If user is NOT active
                //retornar que o usuário ja está como cancelado e não houve alterações no banco de dados

            } else {
                //await prisma.$executeRaw`UPDATE Registers SET  active= ${false} WHERE email = ${email} AND fullName = ${fullName}`
                //retornar que a solicitação de cancelamento foi recebida e encaminhada para uma fila morta
            }
        }


    }

}