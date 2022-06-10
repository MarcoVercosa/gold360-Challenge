import { Channel } from "amqplib"

export interface IParams {
    token: string;
    fullName: string,
    email: string,
    password: string,
}

export interface IInputsValidates {
    sucess: boolean;
    result: {
        firstNameValidate: string,
        fullNameValidate: string,
        emailValidate: string,
        passwordValidate: string
    }
}

export interface IReturn {
    sucess: boolean;
    comparatorKey: string;
    message: string
}

export interface IRequestCreateUpdateRegisterUseCase {
    CheckFirstQueueCreateUpdateRegisterBD: () => Promise<Channel | null>
    Execute: ((Params: IParams) => Promise<{
        sucess: boolean;
        token: string;
        result: IReturn | string//| string | Promise<string>
    }>)
}