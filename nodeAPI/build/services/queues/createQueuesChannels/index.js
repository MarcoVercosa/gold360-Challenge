"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQueue = void 0;
const dotenv_1 = require("dotenv");
const amqplib_1 = require("amqplib");
const createLogs_1 = require("../../createLogs/createLogs");
async function CreateQueue(user, password, queueName) {
    (0, dotenv_1.config)();
    try {
        let nameServer = `amqp://${user}:${password}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`;
        const connection = await (0, amqplib_1.connect)(nameServer);
        connection.once("close", () => {
            createLogs_1.Logger.info(`Rabbitmq => Connection closed after 20 secs -- ${queueName}`);
        });
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true, exclusive: false, autoDelete: false });
        //only created if queue does not exist
        //durable:true: if container or node restart, the queue keep created
        setTimeout(function () {
            try {
                connection.close();
            }
            catch (error) {
                createLogs_1.Logger.error(`RABBITMQ => UNABLE to close a connection. Maybe due to some failure the connection is already closed -- ${queueName} error: ${error}`);
            }
        }, 20000);
        createLogs_1.Logger.info(`RABBITMQ => Connected to habbitMQ. Checked if Queue was created: ${queueName}`);
        return channel;
    }
    catch (error) {
        createLogs_1.Logger.error(`RABBITMQ => ERROR to connect to RabbitMQ. Queue failed: ${queueName} -- ${error} -- New try in 5 secs`);
        setTimeout(() => {
            CreateQueue(user, password, queueName);
        }, 5000);
    }
}
exports.CreateQueue = CreateQueue;
//# sourceMappingURL=index.js.map