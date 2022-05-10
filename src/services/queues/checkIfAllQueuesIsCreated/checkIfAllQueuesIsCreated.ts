import { CreateQueue } from "../createQueuesChannels";
import { config } from "dotenv"
import { Channel } from "amqplib";

async function CheckIfAllQueuesIsCreated() {
    config()
    let createUpdateRegisterQueue = await CreateQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string) as Channel
    let createCancelregisterQueue = await CreateQueue(process.env.QUEUE_NAME_CANCEL_REGISTER as string) as Channel
    let createDeadCancelQueue = await CreateQueue(process.env.QUEUE_NAME_DEAD_CANCEL as string) as Channel

    console.log(createUpdateRegisterQueue, createCancelregisterQueue, createDeadCancelQueue)
    if (createUpdateRegisterQueue && createCancelregisterQueue && createDeadCancelQueue) {
        return { sucess: true, message: "queus created | already exists successfully" }
    } else {
        return { sucess: false, message: "Server not started. There was a failure in some queue" }
    }
}
export { CheckIfAllQueuesIsCreated }