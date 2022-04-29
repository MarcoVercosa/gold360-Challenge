//require('dotenv').config()
import { config } from "dotenv"
import { Channel, connect } from "amqplib"

export async function CreateQueue(queueName: string): Promise<Channel | null> {
    config()
    try {
        const connection = await connect(process.env.AMQP_QUEUE_SERVER as string)
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName) //somente criada se a fila não existir

        setTimeout(function () { connection.close(); }, 10000);//close conection after 10 seconds
        console.log("Connected to habbitMQ. checked if Queue is created:" + queueName)
        return channel
    } catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: " + queueName + " " + err)
        return null
    }
}

export async function CreateQueueConfirmRegisterUpdate(): Promise<Channel | null> {
    config()
    try {
        const connection = await connect(process.env.AMQP_QUEUE_SERVER as string)
        const channel = await connection.createChannel()
        await channel.assertQueue(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string) //somente criada se a fila não existir

        setTimeout(function () { connection.close(); }, 10000);//close conection after 10 seconds
        console.log("Connected to habbitMQ. Queue created: confirm_create_update_register_bd")
        return channel
    } catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: confirm_create_update_register_bd." + err)
        return null
    }
}

export async function ConsumeQueueConfirmCreateUpdateRegisterBD(comparatorKey: string) {
    return new Promise(async (resolve) => {
        let OpenConectionQueue = await CreateQueue(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string)
        if (!OpenConectionQueue) {
            return null
        }
        OpenConectionQueue.consume(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string, async (data: any) => {
            let result = await JSON.parse(data.content)///change from  buffer to object       

            if (result.comparatorKey == comparatorKey) {
                console.log("caiu IF consume")
                OpenConectionQueue?.ack(data)
                OpenConectionQueue?.close()
                resolve(result)
            }
        }, { noAck: false })
    })
}