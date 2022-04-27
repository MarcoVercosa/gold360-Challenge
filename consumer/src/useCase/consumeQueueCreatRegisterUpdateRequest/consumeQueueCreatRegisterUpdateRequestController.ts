import { ConsumeQueueCreatRegisterUpdateRequestUseCase } from "./consumeQueueCreatRegisterUpdateRequestUseCase"
import { config } from "dotenv"
import { IConsumeQueueCreatRegisterUpdateController } from "../../entities/CreatRegisterUpdateRequest/IConsumeQueueCreatRegisterUpdateController";

export interface IResult {
    sucess: boolean;
    result: string
}



export class ConsumeQueueCreatRegisterUpdateController implements IConsumeQueueCreatRegisterUpdateController {

    constructor(
        private consumeQueueCreatRegisterUpdateRequestUseCase: ConsumeQueueCreatRegisterUpdateRequestUseCase
    ) { }


    async Handle(): Promise<any> {
        config()
        try {
            await this.consumeQueueCreatRegisterUpdateRequestUseCase.ConsumeQueue()

        }
        catch (err: any) {
            console.log({ result: err, codeResult: 500 })
            return { result: err, codeResult: 500 }
        }
    }

}