import { Channel, connect } from "amqplib"
import { config } from "dotenv"
import { Logger } from "../createLogs/createLogs"


async function ConnectAMQPQueueServe(): Promise<{ channelOpen: Channel, connection: any } | any> {
    let nameServer: string = `amqp://${process.env.CREDENTIALS_CANCEL_USER_CONSUMER}:${process.env.CREDENTIALS_CANCEL_PASS_CONSUMER}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect(nameServer)
            const channelOpen = await connection.createChannel()
            //channelOpen.prefetch(1);
            Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${process.env.QUEUE_NAME_CANCEL_REGISTER}`)
            resolve({ channelOpen, connection })
        }
        catch (error: any) {
            Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${process.env.QUEUE_NAME_CANCEL_REGISTER} -- ${error}`)
            reject({ channelOpen: false, connection: error })
        }
    })
}

async function ConnectCancelDeadQueue() {
    config()
    let queueName: string = process.env.QUEUE_NAME_DEAD_CANCEL as string
    let nameServer: string = `amqp://${process.env.CREDENTIALS_DEAD_QUEUE_USER}:${process.env.CREDENTIALS_DEAD_QUEUE_PASS}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`
    try {
        const connection = await connect(nameServer)
        connection.once("close", () => {
            Logger.info(`RABBITMQ => Connection closed after 20 secs -- ${queueName}`)
        })
        const channel = await connection.createChannel()

        setTimeout(function () {
            try {
                connection.close()
                //close conection after 20 seconds
            }
            catch (error) {
                Logger.error(`RABBITMQ => UNABLE to close a connection. Maybe due to some failure the connection is already closed -- ${queueName} error: ${error}`)
            }
        }, 20000);

        Logger.info(`RABBITMQ => Connected to habbitMQ. Checked if Queue was created: ${queueName}`)
        return channel
    } catch (error) {
        Logger.error(`RABBITMQ => ERROR to connect to RabbitMQ. Queue failed: ${queueName} -- ${error} -- New try in 5 secs`)
        setTimeout(() => {
            ConnectCancelDeadQueue()
        }, 5000)
    }
}

export { ConnectAMQPQueueServe, ConnectCancelDeadQueue }