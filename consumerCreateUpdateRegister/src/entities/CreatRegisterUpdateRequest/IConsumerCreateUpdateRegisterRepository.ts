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


export interface IConsumerCreateUpdateRegisterRepository {
    UserIsAdminConfirm: (data: IParamsUserIsAdmin) => Promise<boolean>
    RequestRegisterCreateUpdateRepository: (Params: IParams) => Promise<number>
}



