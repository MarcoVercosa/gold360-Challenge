export interface IParams {
    fullName: String;
    email: string;
    active: boolean
}

export interface IParamsUserIsAdmin {
    idToken: number;
    fullNameToken: string
}

export interface IReturnCheckIsActive {
    id: number;
    firstName: String;
    fullName: String;
    email: String;
    password: String;
    active: Boolean;
    isAdmin: Boolean;
    created_at: string;
    lastLogin: string;
}

export interface IConsumerCancelActiveRegisterRepository {
    UserIsAdminConfirm: (data: IParamsUserIsAdmin) => Promise<boolean>
    CancelActiveRegisterRepository: ({ fullName, email, active }: IParams) => Promise<any>
}

