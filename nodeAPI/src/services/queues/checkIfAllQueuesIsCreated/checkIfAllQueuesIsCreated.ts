import { CreateQueue } from "../createQueuesChannels";
import { config } from "dotenv"
import { Channel } from "amqplib";
import { Logger } from "../../createLogs/createLogs";


async function CheckIfAllQueuesIsCreated() {
    config()
    Logger.info("Checking if all queue are created. Case not, will be created. This action is showing when the server is started")
    try {
        await CreateQueue(
            process.env.CREDENTIALS_REGISTER_USER as string,
            process.env.CREDENTIALS_REGISTER_PASS as string,
            process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string
        ) as Channel
        await CreateQueue(
            process.env.CREDENTIALS_CANCEL_USER as string,
            process.env.CREDENTIALS_CANCEL_PASS as string,
            process.env.QUEUE_NAME_CANCEL_REGISTER as string
        ) as Channel
        await CreateQueue(
            process.env.CREDENTIALS_DEAD_QUEUE_USER as string,
            process.env.CREDENTIALS_DEAD_QUEUE_PASS as string,
            process.env.QUEUE_NAME_DEAD_CANCEL as string
        ) as Channel
    } catch (err) {
        setTimeout(() => {
            Logger.error(`Server not started. Because there was a failure in some queue. New Try in 5 secs`)
            CheckIfAllQueuesIsCreated()
        }, 5000)
    }
}
export { CheckIfAllQueuesIsCreated }