export interface IUserIsAdminConfirm {
    UserIsAdminConfirm: (id: number, fullName: string) => Promise<boolean>
}