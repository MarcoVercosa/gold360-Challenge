import { ConsumerCreateUpdateRegisterUseCase } from "./consumerCreateUpdateRegisterUseCase"
import { config } from "dotenv"
import { IConsumerCreateUpdateRegisterController } from "../../entities/CreatRegisterUpdateRequest/IConsumerCreateUpdateRegisterController";

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
        catch (err: any) {

            console.log({ result: err, codeResult: 500 })
        }
    }

}