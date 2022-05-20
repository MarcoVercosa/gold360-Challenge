import { Channel, connect } from "amqplib"
import { Logger } from "../createLogs/createLogs"
import { ConnectionsName } from "../connections/index"


async function ConnectAMQPQueueServe(): Promise<{ channelOpen: Channel, connection: any } | any> {
    let connections = ConnectionsName()
    return new Promise(async (resolve, reject) => {

        let nameServer: string = `amqp://${connections.credentialsRegisterUserConsumer}:${connections.credentialsRegisterPassConsumer}@${connections.serverRabbitMQ}`
        try {
            const connection = await connect(nameServer)
            const channelOpen = await connection.createChannel()
            //channelOpen.prefetch(1);
            Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${connections.queueNameCreateUpdateRegisterBD}`)
            resolve({ channelOpen, connection })

        }
        catch (error: any) {
            Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${connections.queueNameCreateUpdateRegisterBD} -- ${error}`)
            reject({ channelOpen: false, connection: error })
        }

    })
}

export { ConnectAMQPQueueServe }