import { Channel, connect } from "amqplib"
import { config } from "dotenv"


async function ConnectAMQPQueueServe(): Promise<{ channelOpen: Channel, connection: any } | any> {
    let nameServer: string = `amqp://${process.env.CREDENTIALS_CANCEL_USER_CONSUMER}:${process.env.CREDENTIALS_CANCEL_PASS_CONSUMER}@172.20.0.2:5672`
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect(nameServer)
            const channelOpen = await connection.createChannel()
            //channelOpen.prefetch(1);
            console.log("Connected to habbitMQ." + nameServer)
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
    let nameServer: string = `amqp://${process.env.CREDENTIALS_DEAD_QUEUE_USER}:${process.env.CREDENTIALS_DEAD_QUEUE_PASS}@172.20.0.3:5672`
    try {
        const connection = await connect(nameServer)
        connection.once("close", () => {
            console.log("conexão encerrada")
        })
        const channel = await connection.createChannel()

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
        console.log("Erro to connect to RabbitMQ. Queue failed: " + queueName + " " + err + " New try in 5 secs")
        setTimeout(() => {
            ConnectCancelDeadQueue()
        }, 5000)
    }
}

export { ConnectAMQPQueueServe, ConnectCancelDeadQueue }