import { Channel } from "amqplib"

export interface IParams {
    isAdmin: boolean
    request: any;
    firstName: string,
    fullName: string,
    email: string,
    password: string,
}

export interface IRequestRegisterUseCase {
    CheckFirstQueueCreateUpdateRegisterBD: () => Promise<Channel | null>

    Execute: ((Params: IParams) => Promise<{
        sucess: boolean;
        token: string;
        result: number | string
    }>)
}