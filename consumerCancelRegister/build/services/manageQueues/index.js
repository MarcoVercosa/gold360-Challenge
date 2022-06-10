"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectCancelDeadQueue = exports.ConnectAMQPQueueServer = void 0;
const amqplib_1 = require("amqplib");
const connections_1 = require("../connections");
const createLogs_1 = require("../createLogs/createLogs");
async function ConnectAMQPQueueServer() {
    let connections = (0, connections_1.ConnectionsName)();
    let nameServer = `amqp://${connections.credentialsCancelUserConsumer}:${connections.credentialsCancelPassConsumer}@${connections.serverRabbitMQ}`;
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await (0, amqplib_1.connect)(nameServer);
            const channelOpen = await connection.createChannel();
            //channelOpen.prefetch(1);
            createLogs_1.Logger.info(`RABBITMQ => CONNECTED to habbitMQ to consumed queue -- ${connections.queueNameCancelRegister}`);
            resolve({ channelOpen, connection });
        }
        catch (error) {
            createLogs_1.Logger.error(`RABBITMQ => ERROR to connect RabbitMQ to consumed queue: ${connections.queueNameCancelRegister} -- ${error}`);
            reject({ channelOpen: false, connection: error });
        }
    });
}
exports.ConnectAMQPQueueServer = ConnectAMQPQueueServer;
async function ConnectCancelDeadQueue() {
    let connections = (0, connections_1.ConnectionsName)();
    let nameServer = `amqp://${connections.credentialsDeadQueueUser}:${connections.credentialsDeadQueuePass}@${connections.serverRabbitMQ}`;
    try {
        const connection = await (0, amqplib_1.connect)(nameServer);
        connection.once("close", () => {
            createLogs_1.Logger.info(`RABBITMQ => Connection closed after 20 secs -- ${connections.queueNameDeadCancel}`);
        });
        const channel = await connection.createChannel();
        setTimeout(function () {
            try {
                connection.close();
                //close conection after 20 seconds
            }
            catch (error) {
                createLogs_1.Logger.error(`RABBITMQ => UNABLE to close a connection. Maybe due to some failure the connection is already closed -- ${connections.queueNameDeadCancel} error: ${error}`);
            }
        }, 20000);
        createLogs_1.Logger.info(`RABBITMQ => Connected to habbitMQ. Checked if Queue was created: ${connections.queueNameDeadCancel}`);
        return channel;
    }
    catch (error) {
        createLogs_1.Logger.error(`RABBITMQ => ERROR to connect to RabbitMQ. Queue failed: ${connections.queueNameDeadCancel} -- ${error} -- New try in 5 secs`);
        setTimeout(() => {
            ConnectCancelDeadQueue();
        }, 5000);
    }
}
exports.ConnectCancelDeadQueue = ConnectCancelDeadQueue;
//# sourceMappingURL=index.js.map