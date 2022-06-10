export interface IConsumerCreateUpdateRegisterController {
    Handle(): Promise<{ result: string; codeResult: number }>
}