export interface IRequestActiveRegisterController {
    Handle: (request: any) => Promise<{
        result: number | string;
        codeResult: Number
    }>
}