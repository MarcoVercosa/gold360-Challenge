import { Channel, connect } from "amqplib"

async function ConnectAMQPQueueServe(AMQPQueueServer: string): Promise<{ channelOpen: Channel, connection: any } | any> {

    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect(AMQPQueueServer)
            const channelOpen = await connection.createChannel()
            //channelOpen.prefetch(1);
            console.log("Connected to habbitMQ." + AMQPQueueServer)
            resolve({ channelOpen, connection })

        }
        catch (err: any) {
            reject({ channelOpen: false, connection: err })
        }

    })
}

export { ConnectAMQPQueueServe }