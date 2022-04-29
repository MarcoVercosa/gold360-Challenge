export interface IParams {
    firstName: string,
    fullName: string,
    email: string,
    password: string,
    lastUpDateBy: string,
}

export interface IRequestRegisterRepository {
    UserIsAdminConfirm: (idToken: number, fullNameToken: string) => Promise<boolean>
    RequestRegisterRepository: (Params: IParams) => Promise<number>
}