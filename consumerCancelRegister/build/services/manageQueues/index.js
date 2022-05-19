"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectCancelDeadQueue = exports.ConnectAMQPQueueServe = void 0;
const amqplib_1 = require("amqplib");
const dotenv_1 = require("dotenv");
const createLogs_1 = require("../createLogs/createLogs");
async function ConnectAMQPQueueServe() {
    let nameServer = `amqp://${process.env.CREDENTIALS_CANCEL_USER_CONSUMER}:${process.env.CREDENTIALS_CANCEL_PASS_CONSUMER}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`;
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await (0, amqplib_1.connect)(nameServer);
            const channelOpen = await connection.createChannel();
            //channelOpen.prefetch(1);
            createLogs_1.Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${process.env.QUEUE_NAME_CANCEL_REGISTER}`);
            resolve({ channelOpen, connection });
        }
        catch (error) {
            createLogs_1.Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${process.env.QUEUE_NAME_CANCEL_REGISTER} -- ${error}`);
            reject({ channelOpen: false, connection: error });
        }
    });
}
exports.ConnectAMQPQueueServe = ConnectAMQPQueueServe;
async function ConnectCancelDeadQueue() {
    (0, dotenv_1.config)();
    let queueName = process.env.QUEUE_NAME_DEAD_CANCEL;
    let nameServer = `amqp://${process.env.CREDENTIALS_DEAD_QUEUE_USER}:${process.env.CREDENTIALS_DEAD_QUEUE_PASS}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`;
    try {
        const connection = await (0, amqplib_1.connect)(nameServer);
        connection.once("close", () => {
            createLogs_1.Logger.info(`RABBITMQ => Connection closed after 20 secs -- ${queueName}`);
        });
        const channel = await connection.createChannel();
        setTimeout(function () {
            try {
                connection.close();
                //close conection after 20 seconds
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
            ConnectCancelDeadQueue();
        }, 5000);
    }
}
exports.ConnectCancelDeadQueue = ConnectCancelDeadQueue;
//# sourceMappingURL=index.js.map