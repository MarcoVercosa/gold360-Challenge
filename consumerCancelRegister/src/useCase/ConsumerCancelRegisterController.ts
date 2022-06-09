import { ConsumerCancelRegisterUseCase } from "./consumerCancelRegisterUseCase"
import { config } from "dotenv"
import { IConsumerCancelRegisterController } from "../entities/IConsumerCancelRegisterController"
import { Logger } from "../services/createLogs/createLogs";
export interface IResult {
    sucess: boolean;
    result: string
}

config()

export class ConsumerCancelRegisterController implements IConsumerCancelRegisterController {

    constructor(
        private consumerCancelRegisterUseCase: ConsumerCancelRegisterUseCase
    ) { }
    async Handle(): Promise<any> {
        try {
            await this.consumerCancelRegisterUseCase.ConnectAndConsume()
        }
        catch (error: any) {
            Logger.error(`System => - erro: ${JSON.stringify(error)}`)
        }
    }
}