export interface IConsumerCancelActiveRegisterController {
    Handle(): Promise<{ result: string; codeResult: number }>
}
