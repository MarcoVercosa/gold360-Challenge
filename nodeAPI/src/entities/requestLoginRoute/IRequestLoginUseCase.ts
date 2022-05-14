export interface IReturn {
    sucess: Boolean;
    token: string;
    result: Array<
        [
            {
                id: number;
                fullName: string;
                email: string;
                lastLogin: string;
            }
        ]
    > | string
}

export interface IRequestLoginUseCase {
    Execute: (email: string, password: string) => Promise<IReturn>
}