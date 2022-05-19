"use strict";
function ConnectionsName() {
    let secretJSONWebToken;
    let serverRabbitMQ;
    let serverMySQL;
    let nodeAPI;
    let nodeConsumerCreateUpdateRegister;
    let nodeConsumerCancelRegister;
    let queueNameUpdateRegisterBD;
    let queueNameCancelRegister;
    let queueNameDeadCancel;
    if (process.env.NODE_ENV == "production") {
        require('dotenv').config({ path: '../../../.env' });
        console.log("IF production");
        secretJSONWebToken = process.env.SECRET;
        serverRabbitMQ = process.env.AMQP_QUEUE_SERVER_ADDRESS;
        serverMySQL = process.env.DATABASE_URL;
        nodeAPI = process.env.nodeAPI;
        nodeConsumerCreateUpdateRegister = process.env.nodeConsumerCreateUpdateRegister;
        nodeConsumerCancelRegister = process.env.nodeConsumerCancelRegister;
        queueNameUpdateRegisterBD = process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD;
        queueNameCancelRegister = process.env.QUEUE_NAME_CANCEL_REGISTER;
        queueNameDeadCancel = process.env.QUEUE_NAME_DEAD_CANCEL;
    }
    else {
        require('dotenv').config({ path: '../../../.env.test' });
        console.log("IF developer");
        secretJSONWebToken = process.env.SECRET;
        serverRabbitMQ = process.env.AMQP_QUEUE_SERVER_ADDRESS;
        serverMySQL = process.env.DATABASE_URL;
        nodeAPI = process.env.nodeAPI;
        nodeConsumerCreateUpdateRegister = process.env.nodeConsumerCreateUpdateRegister;
        nodeConsumerCancelRegister = process.env.nodeConsumerCancelRegister;
        queueNameUpdateRegisterBD = process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD;
        queueNameCancelRegister = process.env.QUEUE_NAME_CANCEL_REGISTER;
        queueNameDeadCancel = process.env.QUEUE_NAME_DEAD_CANCEL;
    }
    return {
        secretJSONWebToken,
        serverRabbitMQ, serverMySQL,
        nodeAPI, nodeConsumerCreateUpdateRegister,
        nodeConsumerCancelRegister,
        queueNameUpdateRegisterBD,
        queueNameCancelRegister,
        queueNameDeadCancel
    };
}
//# sourceMappingURL=index.js.map