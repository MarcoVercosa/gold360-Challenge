
export interface IRequestCancelRegisterUseCase {
    Execute: (request: any, id: number, fullName: string) => Promise<{
        sucess: boolean;
        token: string;
        result: number | string
    }>
}