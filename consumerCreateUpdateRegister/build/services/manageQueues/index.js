"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectAMQPQueueServe = void 0;
const amqplib_1 = require("amqplib");
const dotenv_1 = require("dotenv");
const createLogs_1 = require("../createLogs/createLogs");
async function ConnectAMQPQueueServe() {
    (0, dotenv_1.config)();
    return new Promise(async (resolve, reject) => {
        let nameServer = `amqp://${process.env.CREDENTIALS_REGISTER_USER_CONSUMER}:${process.env.CREDENTIALS_REGISTER_PASS_CONSUMER}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`;
        try {
            const connection = await (0, amqplib_1.connect)(nameServer);
            const channelOpen = await connection.createChannel();
            //channelOpen.prefetch(1);
            createLogs_1.Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD}`);
            resolve({ channelOpen, connection });
        }
        catch (error) {
            createLogs_1.Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} -- ${error}`);
            reject({ channelOpen: false, connection: error });
        }
    });
}
exports.ConnectAMQPQueueServe = ConnectAMQPQueueServe;
//# sourceMappingURL=index.js.map