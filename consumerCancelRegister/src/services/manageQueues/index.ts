import { Channel, connect } from "amqplib"
import { ConnectionsName } from "../connections"
import { Logger } from "../createLogs/createLogs"

async function ConnectAMQPQueueServer(): Promise<{ channelOpen: Channel, connection: any } | any> {
    let connections = ConnectionsName()
    let nameServer: string = `amqp://${connections.credentialsCancelUserConsumer}:${connections.credentialsCancelPassConsumer}@${connections.serverRabbitMQ}`
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect(nameServer)
            const channelOpen = await connection.createChannel()
            //channelOpen.prefetch(1);
            Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${connections.queueNameCancelRegister}`)
            resolve({ channelOpen, connection })
        }
        catch (error: any) {
            Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${connections.queueNameCancelRegister} -- ${error}`)
            reject({ channelOpen: false, connection: error })
        }
    })
}


async function ConnectCancelDeadQueue() {
    let connections = ConnectionsName()
    let nameServer: string = `amqp://${connections.credentialsDeadQueueUser}:${connections.credentialsDeadQueuePass}@${connections.serverRabbitMQ}`
    try {
        const connection = await connect(nameServer)
        connection.once("close", () => {
            Logger.info(`RABBITMQ => Connection closed after 20 secs -- ${connections.queueNameDeadCancel}`)
        })
        const channel = await connection.createChannel()

        setTimeout(function () {
            try {
                connection.close()
                //close conection after 20 seconds
            }
            catch (error) {
                Logger.error(`RABBITMQ => UNABLE to close a connection. Maybe due to some failure the connection is already closed -- ${connections.queueNameDeadCancel} error: ${error}`)
            }
        }, 20000);

        Logger.info(`RABBITMQ => Connected to habbitMQ. Checked if Queue was created: ${connections.queueNameDeadCancel}`)
        return channel
    } catch (error) {
        Logger.error(`RABBITMQ => ERROR to connect to RabbitMQ. Queue failed: ${connections.queueNameDeadCancel} -- ${error} -- New try in 5 secs`)
        setTimeout(() => {
            ConnectCancelDeadQueue()
        }, 5000)
    }
}

export { ConnectAMQPQueueServer, ConnectCancelDeadQueue }