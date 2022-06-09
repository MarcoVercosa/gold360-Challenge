interface IReturnConnectionsName {
    secretJSONWebToken: string;
    serverRabbitMQ: string;
    serverMySQL: string;
    serverNodeAPI: string;
    serverNodeConsumerCancelRegister: string;
    serverNodeConsumerCreateUpdateRegister: string;
    queueNameCreateUpdateRegisterBD: string;
    queueNameCancelRegister: string;
    queueNameDeadCancel: string;
    credentialsAdminUser: string;
    credentialsAdminPass: string;
    credentialsRegisterUser: string;
    credentialsRegisterPass: string;
    credentialsRegisterUserConsumer: string;
    credentialsRegisterPassConsumer: string;
    credentialsCancelUser: string;
    credentialsCancelPass: string;
    credentialsCancelUserConsumer: string;
    credentialsCancelPassConsumer: string;
    credentialsDeadQueueUser: string;
    credentialsDeadQueuePass: string;
}

function ConnectionsName(): IReturnConnectionsName {
    if (process.env.NODE_ENV == "production") {
        require('dotenv').config({ path: '../../../.env' })
    } else {
        require('dotenv').config({ path: '../../../.env.dev' })
    }
    return {
        secretJSONWebToken: process.env.SECRET as string,
        serverRabbitMQ: process.env.AMQP_QUEUE_SERVER_ADDRESS as string,
        serverMySQL: process.env.DATABASE_URL as string,
        serverNodeAPI: process.env.NODEAPI as string,
        serverNodeConsumerCreateUpdateRegister: process.env.NODECONSUMERCREATEUPDATEREGISTER as string,
        serverNodeConsumerCancelRegister: process.env.NODECONSUMERCANCELREGISTER as string,
        queueNameCreateUpdateRegisterBD: process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
        queueNameCancelRegister: process.env.QUEUE_NAME_CANCEL_REGISTER as string,
        queueNameDeadCancel: process.env.QUEUE_NAME_DEAD_CANCEL as string,
        credentialsAdminUser: process.env.CREDENTIALS_ADMIN_USER as string,
        credentialsAdminPass: process.env.CREDENTIALS_ADMIN_PASS as string,
        credentialsRegisterUser: process.env.CREDENTIALS_REGISTER_USER as string,
        credentialsRegisterPass: process.env.CREDENTIALS_REGISTER_PASS as string,
        credentialsRegisterUserConsumer: process.env.CREDENTIALS_REGISTER_USER_CONSUMER as string,
        credentialsRegisterPassConsumer: process.env.CREDENTIALS_REGISTER_PASS_CONSUMER as string,
        credentialsCancelUser: process.env.CREDENTIALS_CANCEL_USER as string,
        credentialsCancelPass: process.env.CREDENTIALS_CANCEL_PASS as string,
        credentialsCancelUserConsumer: process.env.CREDENTIALS_CANCEL_USER_CONSUMER as string,
        credentialsCancelPassConsumer: process.env.CREDENTIALS_CANCEL_PASS_CONSUMER as string,
        credentialsDeadQueueUser: process.env.CREDENTIALS_DEAD_QUEUE_USER as string,
        credentialsDeadQueuePass: process.env.CREDENTIALS_DEAD_QUEUE_PASS as string
    }
}

export { ConnectionsName }