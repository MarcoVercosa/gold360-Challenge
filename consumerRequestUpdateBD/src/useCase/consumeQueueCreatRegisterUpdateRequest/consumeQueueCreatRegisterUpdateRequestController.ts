import { ConsumeQueueCreatRegisterUpdateRequestUseCase } from "./consumeQueueCreatRegisterUpdateRequestUseCase"
import { config } from "dotenv"
import { IConsumeQueueCreatRegisterUpdateController } from "../../entities/CreatRegisterUpdateRequest/IConsumeQueueCreatRegisterUpdateController";
import { ConnectAMQPQueueServe } from "../../manageQueues";
import { IParams } from "../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestUseCase";

export interface IResult {
    sucess: boolean;
    result: string
}

config()

export class ConsumeQueueCreateRegisterUpdateController implements IConsumeQueueCreatRegisterUpdateController {

    connectionQueue: any;


    constructor(

        private consumeQueueCreatRegisterUpdateRequestUseCase: ConsumeQueueCreatRegisterUpdateRequestUseCase
    ) {
        this.connectionQueue = null
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }

    async Handle(): Promise<any> {
        try {
            console.log("Requested connection creation for consume")
            let { channelOpen } = await ConnectAMQPQueueServe(process.env.AMQP_QUEUE_SERVER as string)
            if (!channelOpen) {
                return null
            }
            this.connectionQueue = channelOpen
            //the only conection

            channelOpen.consume(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
                async (data: any) => {
                    let dataConsume: IParams = await JSON.parse(data.content)///change from  buffer to object                
                    channelOpen?.ack(data)
                    let result = await this.consumeQueueCreatRegisterUpdateRequestUseCase.Execute(dataConsume) as Promise<{ sucess: boolean, comparatorKey: string, message: string }>
                    //request store data in BD
                    await this.consumeQueueCreatRegisterUpdateRequestUseCase.SendConfirmQueueCreateUpdateBD(this.connectionQueue, result)
                    //sendo to confirmation to queue
                }, { noAck: false }
            ) as any
        }
        catch (err: any) {
            await this.consumeQueueCreatRegisterUpdateRequestUseCase
                .SendConfirmQueueCreateUpdateBD(this.connectionQueue, { sucess: false, comparatorKey: "", message: err })
            console.log({ result: err, codeResult: 500 })
        }
    }

}