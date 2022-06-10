import { Channel } from "amqplib"

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
    firstName: string,
    fullName: string,
    email: string,
    password: string,
    comparatorKey: string

}

export interface IConsumerCreateUpdateRegisterUseCase {

    ConnectAndConsume: () => void
    Consume: () => void
    Execute(dataQueueConsumed: IParams): Promise<{ sucess: boolean, comparatorKey: string, message: string }>
}

export interface ITokenDecoded {
    idToken: number;
    fullNameToken: string
}