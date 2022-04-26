export interface IParams {
    firstName: string,
    fullName: string,
    email: string,
    password: string,
    lastUpDateBy: string,
}

export interface IParamsUserIsAdmin {
    idToken: number;
    fullNameToken: string
}


export interface ICreatRegisterUpdateRequestRepository {
    UserIsAdminConfirm: (data: IParamsUserIsAdmin) => Promise<boolean>
    CheckIfRegisterAlreadyExists: (email: string, fullName: string) => Promise<[]>
    RequestRegisterRepository: (Params: IParams) => Promise<number>
}



