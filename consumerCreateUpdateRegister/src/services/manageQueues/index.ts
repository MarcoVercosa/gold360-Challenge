import { Channel, connect } from "amqplib"
import { config } from "dotenv"

async function ConnectAMQPQueueServe(): Promise<{ channelOpen: Channel, connection: any } | any> {
    config()
    return new Promise(async (resolve, reject) => {
        let nameServer: string = `amqp://${process.env.CREDENTIALS_REGISTER_USER_CONSUMER}:${process.env.CREDENTIALS_REGISTER_PASS_CONSUMER}@localhost:5672`
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

export { ConnectAMQPQueueServe }