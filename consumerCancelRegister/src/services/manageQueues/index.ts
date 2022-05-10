import { Channel, connect } from "amqplib"
import { config } from "dotenv"


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

async function ConnectCancelDeadQueue() {
    config()
    let queueName: string = process.env.QUEUE_NAME_DEAD_CANCEL as string
    try {
        const connection = await connect(process.env.AMQP_QUEUE_SERVER as string)
        connection.once("close", () => {
            console.log("conexão encerrada")
        })
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName as string, { durable: true, exclusive: false, autoDelete: false })
        //only created if queue does not exist
        //durable:true: if container or node restart, the queue keep created

        setTimeout(function () {
            try {
                connection.close()
                //close conection after 20 seconds
            }
            catch (err) {
                console.log("Unable to close a connection. Maybe due to some failure the connection is already closed")
            }
        }, 20000);

        console.log("Connected to habbitMQ. checked if Queue is created:" + queueName)
        return channel
    } catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: " + queueName + " " + err + "New try in 5 secs")
        setTimeout(() => {
            ConnectCancelDeadQueue()
        }, 5000)
    }
}

export { ConnectAMQPQueueServe, ConnectCancelDeadQueue }