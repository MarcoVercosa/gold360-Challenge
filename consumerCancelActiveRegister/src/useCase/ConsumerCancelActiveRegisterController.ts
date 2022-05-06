import { ConsumerCancelActiveRegisterUseCase } from "./consumerCancelActiveRegisterUseCase"
import { config } from "dotenv"
import { IConsumerCancelActiveRegisterController } from "../entities/IConsumerCancelActiveRegisterController"
export interface IResult {
    sucess: boolean;
    result: string
}

config()

export class ConsumerCancelActiveRegisterController implements IConsumerCancelActiveRegisterController {

    constructor(

        private consumerCancelActiveRegisterUseCase: ConsumerCancelActiveRegisterUseCase
    ) { }
    async Handle(): Promise<any> {
        try {
            await this.consumerCancelActiveRegisterUseCase.ConnectAndConsume()
        }
        catch (err: any) {

            console.log({ result: err, codeResult: 500 })
        }
    }
}