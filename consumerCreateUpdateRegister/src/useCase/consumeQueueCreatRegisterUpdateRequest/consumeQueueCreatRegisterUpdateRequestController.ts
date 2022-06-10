import { ConsumerCreateUpdateRegisterUseCase } from "./consumerCreateUpdateRegisterUseCase"
import { config } from "dotenv"
import { IConsumerCreateUpdateRegisterController } from "../../entities/CreatRegisterUpdateRequest/IConsumerCreateUpdateRegisterController";
import { Logger } from "../../services/createLogs/createLogs";

export interface IResult {
    sucess: boolean;
    result: string
}

config()

export class ConsumerCreateUpdateRegisterController implements IConsumerCreateUpdateRegisterController {

    constructor(

        private consumeQueueCreatRegisterUpdateRequestUseCase: ConsumerCreateUpdateRegisterUseCase
    ) { }
    async Handle(): Promise<any> {
        try {
            await this.consumeQueueCreatRegisterUpdateRequestUseCase.ConnectAndConsume()
        }
        catch (error: any) {
            Logger.error(`System => - erro: ${JSON.stringify(error)}`)
        }
    }
}