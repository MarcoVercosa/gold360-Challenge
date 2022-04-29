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

export interface ICreatRegisterUpdateRequestUseCase {

    // ConnectAMQPQueueServer: () => Promise<Channel | null>
    // ConsumeQueue(): Promise<{ sucess: boolean, result: string } | null>
    Execute(): Promise<{ sucess: boolean, result: string }>
}

export interface ITokenDecoded {
    idToken: number;
    fullNameToken: string
}