export interface IParams {
    token: string
    fullName: string;
    email: string;
    active: boolean
}

export interface IInputsValidates {
    sucess: boolean;
    result: {
        fullNameValidate: string,
        emailValidate: string,
        activeValidate: boolean
    }
}

export interface IReturn {
    sucess: boolean;
    comparatorKey: string;
    message: string
}


export interface IRequestCancelActiveRegisterUseCase {
    Execute: (request: any, id: number, fullName: string) => Promise<{
        sucess: boolean;
        token: string;
        result: IReturn | string
    }>
}


