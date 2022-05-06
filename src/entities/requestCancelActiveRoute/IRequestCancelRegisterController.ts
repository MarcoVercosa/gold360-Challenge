export interface IRequestCancelRegisterController {
    Handle: (request: any) => Promise<{
        result: number | string;
        codeResult: Number
    }>
}

export interface IParams {
    fullName: string;
    email: string;
    active: boolean
}
