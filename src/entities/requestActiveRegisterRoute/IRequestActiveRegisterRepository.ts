export interface IRequestActiveRegisterRepository {
    UserIsAdminConfirm: (idToken: number, fullNameToken: string) => Promise<boolean>
    RequestActiveRepository: (id: number, fullName: string) => Promise<number>
}