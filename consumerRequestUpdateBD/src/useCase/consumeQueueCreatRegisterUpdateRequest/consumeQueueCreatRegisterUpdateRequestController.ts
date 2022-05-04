import { ConsumeQueueCreatRegisterUpdateRequestUseCase } from "./consumeQueueCreatRegisterUpdateRequestUseCase"
import { config } from "dotenv"
import { IConsumeQueueCreatRegisterUpdateController } from "../../entities/CreatRegisterUpdateRequest/IConsumeQueueCreatRegisterUpdateController";

export interface IResult {
    sucess: boolean;
    result: string
}

config()

export class ConsumeQueueCreateRegisterUpdateController implements IConsumeQueueCreatRegisterUpdateController {

    constructor(

        private consumeQueueCreatRegisterUpdateRequestUseCase: ConsumeQueueCreatRegisterUpdateRequestUseCase
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