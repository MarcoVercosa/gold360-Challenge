export interface IParams {
    token: string
    fullName: string;
    email: string;
}

export interface IInputsValidates {
    sucess: boolean;
    result: {
        fullNameValidate: string,
        emailValidate: string,
    }
}

export interface IReturn {
    sucess: boolean;
    comparatorKey: string;
    message: string
}


export interface IRequestCancelRegisterUseCase {
    Execute: (request: any, id: number, fullName: string) => Promise<{
        sucess: boolean;
        token: string;
        result: IReturn | string
    }>
}


