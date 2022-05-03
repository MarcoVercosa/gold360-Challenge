//require('dotenv').config()
import { config } from "dotenv"
import { Channel, connect } from "amqplib"

export async function CreateQueue(queueName: string): Promise<Channel | void> {
    config()
    try {
        const connection = await connect(process.env.AMQP_QUEUE_SERVER as string)
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName) //somente criada se a fila não existir

        setTimeout(function () { connection.close(); }, 10000);//close conection after 10 seconds
        console.log("Connected to habbitMQ. checked if Queue is created:" + queueName)
        return channel
    } catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: " + queueName + " " + err + "New try in 5 secs")
        setTimeout(() => {
            CreateQueue(queueName)
        }, 5000)
        //return null
    }
}

export async function CreateQueueConfirmRegisterUpdate(): Promise<Channel | null> {
    config()
    try {
        const connection = await connect(process.env.AMQP_QUEUE_SERVER as string)
        const channel = await connection.createChannel()
        await channel.assertQueue(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string) //somente criada se a fila não existir

        //setTimeout(function () { connection.close(); }, 10000);//close conection after 10 seconds
        console.log("Connected to habbitMQ. Queue created: confirm_create_update_register_bd")
        return channel
    } catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: confirm_create_update_register_bd." + err)
        return null
    }
}

export async function ConsumeQueueConfirmCreateUpdateRegisterBD(comparatorKey: string) {
    return new Promise(async (resolve) => {
        let openConectionQueue = await CreateQueue(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string)
        if (!openConectionQueue) {
            return null
        }
        //openConectionQueue.prefetch(1, false)
        openConectionQueue.consume(process.env.QUEUE_NAME_CONFIRM_CREATE_UPDATE_REGISTER_BD as string, async (data: any) => {
            console.log("Data receveid")
            let result = await JSON.parse(data.content)///change from  buffer to object       
            if (result.comparatorKey == comparatorKey) {
                console.log("caiu no if")
                openConectionQueue?.ack(data)
                openConectionQueue?.close()
                resolve(result)
            }
        }, { noAck: false })
    })
}