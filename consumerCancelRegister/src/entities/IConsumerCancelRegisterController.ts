export interface IConsumerCancelRegisterController {
    Handle(): Promise<{ result: string; codeResult: number }>
}
