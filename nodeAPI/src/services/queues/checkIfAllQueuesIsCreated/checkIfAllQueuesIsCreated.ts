import { CreateQueue } from "../createQueuesChannels";
import { Channel } from "amqplib";
import { Logger } from "../../createLogs/createLogs";
import { ConnectionsName } from "../../connections/index"


async function CheckIfAllQueuesIsCreated() {
    let connections = ConnectionsName()
    Logger.info("Checking if all queue are created. Case not, will be created. This action is showing when the server is started")
    try {
        await CreateQueue(
            connections.credentialsRegisterUser,
            connections.credentialsRegisterPass,
            connections.queueNameCreateUpdateRegisterBD
        ) as Channel
        await CreateQueue(
            connections.credentialsCancelUser,
            connections.credentialsCancelPass,
            connections.queueNameCancelRegister
        ) as Channel
        await CreateQueue(
            connections.credentialsDeadQueueUser,
            connections.credentialsDeadQueuePass,
            connections.queueNameDeadCancel,
        ) as Channel
    } catch (err) {
        setTimeout(() => {
            Logger.error(`Server not started. Because there was a failure in some queue. New Try in 5 secs`)
            CheckIfAllQueuesIsCreated()
        }, 5000)
    }
}
export { CheckIfAllQueuesIsCreated }