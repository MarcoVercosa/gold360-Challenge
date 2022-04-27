import { Channel } from "amqplib"

export interface IParams {
    firstName: string,
    fullName: string,
    email: string,
    password: string,
    lastUpDateBy: string,
    idToken: number;
    fullNameToken: string
}

export interface ICreatRegisterUpdateRequestUseCase {

    ConnectAMQPQueueServer: () => Promise<Channel | null>
    ConsumeQueue(): Promise<{ sucess: boolean, result: string } | null>
    Execute(): Promise<{ sucess: boolean, result: string }>
}