import { Channel } from "amqplib"

export interface IParams {
    request: any;
    fullName: string,
    email: string,
    password: string,
}

export interface IRequestRegisterUseCase {
    CheckFirstQueueCreateUpdateRegisterBD: () => Promise<Channel | null>

    Execute: ((Params: IParams) => Promise<{
        sucess: boolean;
        token: string;
        result: number | string | Promise<string>
    }> | Promise<any>)
}