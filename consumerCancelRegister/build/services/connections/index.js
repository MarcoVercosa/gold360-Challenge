"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsName = void 0;
function ConnectionsName() {
    if (process.env.NODE_ENV == "production") {
        require('dotenv').config({ path: '../../../.env' });
    }
    else {
        require('dotenv').config({ path: '../../../.env.dev' });
    }
    return {
        secretJSONWebToken: process.env.SECRET,
        serverRabbitMQ: process.env.AMQP_QUEUE_SERVER_ADDRESS,
        serverMySQL: process.env.DATABASE_URL,
        serverNodeAPI: process.env.NODEAPI,
        serverNodeConsumerCreateUpdateRegister: process.env.NODECONSUMERCREATEUPDATEREGISTER,
        serverNodeConsumerCancelRegister: process.env.NODECONSUMERCANCELREGISTER,
        queueNameCreateUpdateRegisterBD: process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD,
        queueNameCancelRegister: process.env.QUEUE_NAME_CANCEL_REGISTER,
        queueNameDeadCancel: process.env.QUEUE_NAME_DEAD_CANCEL,
        credentialsAdminUser: process.env.CREDENTIALS_ADMIN_USER,
        credentialsAdminPass: process.env.CREDENTIALS_ADMIN_PASS,
        credentialsRegisterUser: process.env.CREDENTIALS_REGISTER_USER,
        credentialsRegisterPass: process.env.CREDENTIALS_REGISTER_PASS,
        credentialsRegisterUserConsumer: process.env.CREDENTIALS_REGISTER_USER_CONSUMER,
        credentialsRegisterPassConsumer: process.env.CREDENTIALS_REGISTER_PASS_CONSUMER,
        credentialsCancelUser: process.env.CREDENTIALS_CANCEL_USER,
        credentialsCancelPass: process.env.CREDENTIALS_CANCEL_PASS,
        credentialsCancelUserConsumer: process.env.CREDENTIALS_CANCEL_USER_CONSUMER,
        credentialsCancelPassConsumer: process.env.CREDENTIALS_CANCEL_PASS_CONSUMER,
        credentialsDeadQueueUser: process.env.CREDENTIALS_DEAD_QUEUE_USER,
        credentialsDeadQueuePass: process.env.CREDENTIALS_DEAD_QUEUE_PASS
    };
}
exports.ConnectionsName = ConnectionsName;
//# sourceMappingURL=index.js.map