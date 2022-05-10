import { ConsumerCancelRegisterUseCase } from "./consumerCancelRegisterUseCase"
import { config } from "dotenv"
import { IConsumerCancelRegisterController } from "../entities/IConsumerCancelRegisterController"
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
        catch (err: any) {

            console.log({ result: err, codeResult: 500 })
        }
    }
}