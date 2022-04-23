export interface IReturn {
    sucess?: Boolean;
    token: string;
    result?: Array<{
        data: [
            {
                id: number,
                fullName: string,
                email: string,
                password: string,
                active: number,
                created_at: string,
                firstName: string,
                canceled: number,
                isAdmin: number
            }
        ]
    }> | string
}

export interface IRequestLoginUseCase {
    Execute: (email: string, password: string) => Promise<IReturn>
}