"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectAMQPQueueServe = void 0;
const amqplib_1 = require("amqplib");
const dotenv_1 = require("dotenv");
async function ConnectAMQPQueueServe() {
    (0, dotenv_1.config)();
    return new Promise(async (resolve, reject) => {
        let nameServer = `amqp://${process.env.CREDENTIALS_REGISTER_USER_CONSUMER}:${process.env.CREDENTIALS_REGISTER_PASS_CONSUMER}@${process.env.AMQP_QUEUE_SERVER_ADDRESS}`;
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
//# sourceMappingURL=index.js.map