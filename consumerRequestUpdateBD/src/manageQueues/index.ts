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


// async function ConsumeQueueCreateUpdateBD(AMQPQueueServer: string, nameQueue: string): Promise<IParams | null> {

//     let OpenConectionQueue = await ConnectAMQPQueueServeCreateUpdateBD(AMQPQueueServer, nameQueue)
//     if (!OpenConectionQueue) {
//         return null
//     }
//     let resultData: Promise<IParams>
//     resultData = await OpenConectionQueue.consume(nameQueue,
//         async (data: any) => {
//             let dataConsume: any = await JSON.parse(data.content)//change de buffer to string and JSON.parse to object                
//             console.log(dataConsume)
//             OpenConectionQueue?.ack(data)
//             return dataConsume
//         }, { noAck: false }
//     ) as any

//     return resultData
// }

// async function SendConfirmQueueCreateUpdateBD(AMQPQueueServer: string, nameQueue: string, data: string): Promise<any> {
//     let OpenConectionQueue = await ConnectAMQPQueueServeCreateUpdateBD(AMQPQueueServer, nameQueue)
//     if (!OpenConectionQueue) {
//         return null
//     }
//     OpenConectionQueue.sendToQueue(nameQueue, Buffer.from(JSON.stringify(data)), { persistent: true })

// }

export { ConnectAMQPQueueServe }