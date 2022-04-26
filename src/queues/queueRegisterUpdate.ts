//require('dotenv').config()
import { config } from "dotenv"
import { Channel, connect } from "amqplib"

export async function CreateQueueRegisterUpdate(): Promise<Channel | null> {
    config()
    try {
        const connection = await connect(process.env.AMQP_QUEUE_SERVER as string)
        const channel = await connection.createChannel()
        await channel.assertQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string) //somente criada se a fila não existir
        setTimeout(function () { connection.close(); }, 10000);
        console.log("Connected to habbitMQ. Queue created: create_update_register_bd" + channel)
        return channel
    } catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: create_update_register_bd." + err)
        return null
    }

}