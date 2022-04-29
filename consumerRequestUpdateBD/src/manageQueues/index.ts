import { Channel, connect } from "amqplib"

async function ConnectAMQPQueueServe(AMQPQueueServer: string): Promise<{ channelOpen: Channel, connection: any } | any> {
    try {
        const connection = await connect(AMQPQueueServer)
        const channelOpen = await connection.createChannel()
        console.log("Connected to habbitMQ." + AMQPQueueServer)
        return { channelOpen, connection }
    } catch (err) {
        console.log("Error to connect to RabbitMQ." + err)
        return null
    }
}

export { ConnectAMQPQueueServe }