export interface IParams {
    validateToken: {
        auth: boolean,
        result: {
            id: number,
            fullName: string,
            iat: number,
            exp: number
        }
    },
    fullName: string,
    email: string,
    comparatorKey: string

}


export interface IConsumerCancelRegisterUseCase {
    ConnectAndConsume: () => void
    Consume: () => void
    Execute(dataQueueConsumed: IParams): Promise<{ sucess: boolean, comparatorKey: string, message: string }>
}
