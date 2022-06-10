export interface IParams {
    fullName: String;
    email: string;

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

    isAdmin: Boolean;
    created_at: string;
    lastLogin: string;
}

export interface IConsumerCancelRegisterRepository {
    UserIsAdminConfirm: (data: IParamsUserIsAdmin) => Promise<boolean>
    CancelRegisterRepository: ({ fullName, email }: IParams) => Promise<any>
    CheckIfIsActiveRepository: ({ fullName, email }: { fullName: string, email: string }) => Promise<Array<{ active: boolean }>>
}

