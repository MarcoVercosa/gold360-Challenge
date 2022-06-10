"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectAMQPQueueServe = void 0;
const amqplib_1 = require("amqplib");
const createLogs_1 = require("../createLogs/createLogs");
const index_1 = require("../connections/index");
async function ConnectAMQPQueueServe() {
    let connections = (0, index_1.ConnectionsName)();
    return new Promise(async (resolve, reject) => {
        let nameServer = `amqp://${connections.credentialsRegisterUserConsumer}:${connections.credentialsRegisterPassConsumer}@${connections.serverRabbitMQ}`;
        try {
            const connection = await (0, amqplib_1.connect)(nameServer);
            const channelOpen = await connection.createChannel();
            //channelOpen.prefetch(1);
            createLogs_1.Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${connections.queueNameCreateUpdateRegisterBD}`);
            resolve({ channelOpen, connection });
        }
        catch (error) {
            createLogs_1.Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${connections.queueNameCreateUpdateRegisterBD} -- ${error}`);
            reject({ channelOpen: false, connection: error });
        }
    });
}
exports.ConnectAMQPQueueServe = ConnectAMQPQueueServe;
//# sourceMappingURL=index.js.map