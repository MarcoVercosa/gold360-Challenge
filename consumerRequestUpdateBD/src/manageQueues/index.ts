import { Channel, connect } from "amqplib"

async function ConnectAMQPQueueServe(AMQPQueueServer: string): Promise<{ channelOpen: Channel, connection: any } | any> {
    try {
        const connection = await connect(AMQPQueueServer)
        const channelOpen = await connection.createChannel()
        channelOpen.prefetch(1);
        console.log("Connected to habbitMQ." + AMQPQueueServer)
        return { channelOpen, connection }
    } catch (err) {
        setTimeout(() => {
            ConnectAMQPQueueServe(AMQPQueueServer)
        }, 2000)
        console.log("Error to connect to RabbitMQ:" + err + " New try in 2 secs")

    }
}

export { ConnectAMQPQueueServe }