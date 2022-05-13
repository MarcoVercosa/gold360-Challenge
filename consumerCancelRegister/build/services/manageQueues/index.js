"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectCancelDeadQueue = exports.ConnectAMQPQueueServe = void 0;
const amqplib_1 = require("amqplib");
const dotenv_1 = require("dotenv");
async function ConnectAMQPQueueServe() {
    let nameServer = `amqp://${process.env.CREDENTIALS_CANCEL_USER_CONSUMER}:${process.env.CREDENTIALS_CANCEL_PASS_CONSUMER}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`;
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await (0, amqplib_1.connect)(nameServer);
            const channelOpen = await connection.createChannel();
            //channelOpen.prefetch(1);
            console.log("Connected to habbitMQ." + nameServer);
            resolve({ channelOpen, connection });
        }
        catch (err) {
            reject({ channelOpen: false, connection: err });
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
            console.log("conexão encerrada");
        });
        const channel = await connection.createChannel();
        setTimeout(function () {
            try {
                connection.close();
                //close conection after 20 seconds
            }
            catch (err) {
                console.log("Unable to close a connection. Maybe due to some failure the connection is already closed");
            }
        }, 20000);
        console.log("Connected to habbitMQ. checked if Queue is created:" + queueName);
        return channel;
    }
    catch (err) {
        console.log("Erro to connect to RabbitMQ. Queue failed: " + queueName + " " + err + " New try in 5 secs");
        setTimeout(() => {
            ConnectCancelDeadQueue();
        }, 5000);
    }
}
exports.ConnectCancelDeadQueue = ConnectCancelDeadQueue;
//# sourceMappingURL=index.js.map