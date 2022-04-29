export interface IRequestCancelRegisterRepository {
    UserIsAdminConfirm: (idToken: number, fullNameToken: string) => Promise<boolean>
    RequestCancelRepository: (id: number, fullName: string) => Promise<number>
}