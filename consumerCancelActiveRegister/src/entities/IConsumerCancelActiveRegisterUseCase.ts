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
    active: boolean;
    comparatorKey: string

}


export interface IConsumerCancelActiveRegisterUseCase {
    ConnectAndConsume: () => void
    Consume: () => void
    Execute(dataQueueConsumed: IParams): Promise<{ sucess: boolean, comparatorKey: string, message: string }>
}
