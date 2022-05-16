import { Channel, connect } from "amqplib"
import { config } from "dotenv"
import { Logger } from "../createLogs/createLogs"


async function ConnectAMQPQueueServe(): Promise<{ channelOpen: Channel, connection: any } | any> {
    config()
    return new Promise(async (resolve, reject) => {
        let nameServer: string = `amqp://${process.env.CREDENTIALS_REGISTER_USER_CONSUMER}:${process.env.CREDENTIALS_REGISTER_PASS_CONSUMER}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`
        try {
            const connection = await connect(nameServer)
            const channelOpen = await connection.createChannel()
            //channelOpen.prefetch(1);
            Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD}`)
            resolve({ channelOpen, connection })

        }
        catch (error: any) {
            Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} -- ${error}`)
            reject({ channelOpen: false, connection: error })
        }

    })
}

export { ConnectAMQPQueueServe }