export interface IParams {
    isAdmin: boolean
    request: any;
    firstName: string,
    fullName: string,
    email: string,
    password: string,

}

export interface IRequestRegisterUseCase {
    Execute: ((Params: IParams) => Promise<{
        sucess: boolean;
        token: string;
        result: number | string
    }>)
}