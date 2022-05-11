export interface IRequestLoginRepository {
    RequestLogin: (email: string, password: string) => Promise<Array<any>>
}