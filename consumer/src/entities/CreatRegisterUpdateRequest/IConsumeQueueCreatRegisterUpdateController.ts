export interface IConsumeQueueCreatRegisterUpdateController {
    Handle(): Promise<{ result: string; codeResult: number }>
}