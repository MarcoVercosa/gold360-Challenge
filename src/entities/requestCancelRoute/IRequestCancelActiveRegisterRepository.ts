export interface IRequestCancelActiveRegisterRepository {
    UserIsAdminConfirm: (idToken: number, fullNameToken: string) => Promise<boolean>
    RequestCancelActiveRegisterRepository: (id: number, fullName: string) => Promise<number>
}