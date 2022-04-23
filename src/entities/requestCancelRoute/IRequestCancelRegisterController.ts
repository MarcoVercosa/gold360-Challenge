export interface IRequestCancelRegisterController {
    Handle: (request: any) => Promise<{
        result: number | string;
        codeResult: Number
    }>
}