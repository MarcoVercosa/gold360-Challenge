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
            //check if the channel is connect and add in object de data consumed from the queue
            await this.consumeQueueCreatRegisterUpdateRequestUseCase.ConsumeQueue()
            //now store in BD the data
            // let result: IResult = await this.consumeQueueCreatRegisterUpdateRequestUseCase.Execute()
            // if (result.sucess) {
            //     console.log({ result, codeResult: 200 })
            //     return { result, codeResult: 200 }
            // }
            // else {
            //     console.log({ result, codeResult: 401 })
            //     return { result, codeResult: 401 }
            // }
        }
        catch (err: any) {
            console.log({ result: err, codeResult: 500 })
            return { result: err, codeResult: 500 }
        }
    }

}