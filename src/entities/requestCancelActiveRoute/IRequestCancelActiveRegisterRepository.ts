export interface IRequestCancelActiveRegisterRepository {
    UserIsAdminConfirm: ({ idToken, fullNameToken }: { idToken: string, fullNameToken: string }) => Promise<boolean>
    RequestCancelActiveRegisterRepository: ({ fullName, email, active }: IParams) => Promise<number>
}

export interface IParams {
    fullName: string;
    email: string;
    active: boolean
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