import { Channel, connect } from "amqplib"
import { Logger } from "../../createLogs/createLogs"
import { ConnectionsName } from "../../connections"

export async function CreateQueue(user: string, password: string, queueName: string): Promise<Channel | void> {
    let connecitons = ConnectionsName()
    try {
        let nameServer: string = `amqp://${user}:${password}@${connecitons.serverRabbitMQ}`
        const connection = await connect(nameServer)
        connection.once("close", () => {
            Logger.info(`Rabbitmq => Connection closed after 20 secs -- ${queueName}`)
        })
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName, { durable: true, exclusive: false, autoDelete: false })
        //only created if queue does not exist
        //durable:true: if container or node restart, the queue keep created

        setTimeout(function () {
            try {
                connection.close()
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
            CreateQueue(user, password, queueName)
        }, 5000)
    }
}
