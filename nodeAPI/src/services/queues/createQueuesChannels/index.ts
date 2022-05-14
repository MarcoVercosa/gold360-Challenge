import { config } from "dotenv"
import { Channel, connect } from "amqplib"
import { Logger } from "../../createLogs/createLogs"

export async function CreateQueue(user: string, password: string, queueName: string): Promise<Channel | void> {
    config()
    try {
        let nameServer: string = `amqp://${user}:${password}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`
        const connection = await connect(nameServer)
        connection.once("close", () => {
            Logger.info(`Rabbitmq => Connection closed -- ${queueName}`)
        })
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName, { durable: true, exclusive: false, autoDelete: false })
        //only created if queue does not exist
        //durable:true: if container or node restart, the queue keep created

        setTimeout(function () {
            try {
                connection.close()
            }
            catch (err) {
                Logger.error(`Rabbitmq => Unable to close a connection. Maybe due to some failure the connection is already closed -- ${queueName}`)
            }
        }, 20000);

        Logger.info(`Rabbitmq => Connection closed -- ${queueName}`)

        return channel
    } catch (err) {
        Logger.error(`Rabbitmq => Erro to connect to RabbitMQ. Queue failed: ${queueName} ${err} New try in 5 secs`)
        setTimeout(() => {
            CreateQueue(user, password, queueName)
        }, 5000)
    }
}
