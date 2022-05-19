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

export interface IRequestLoginController {
    Handle: (request: any) => Promise<{ result: IReturn, codeResult: number }>
}