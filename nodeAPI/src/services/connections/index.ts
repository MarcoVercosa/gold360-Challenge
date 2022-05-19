interface IReturnConnectionsName {
    secretJSONWebToken: string;
    serverRabbitMQ: string;
    serverMySQL: string;
    nodeAPI: string;
    nodeConsumerCancelRegister: string;
    nodeConsumerCreateUpdateRegister: string;
    queueNameUpdateRegisterBD: string;
    queueNameCancelRegister: string;
    queueNameDeadCancel: string;
}

function ConnectionsName(): IReturnConnectionsName {
    if (process.env.NODE_ENV == "production") {
        require('dotenv').config({ path: '../../../.env' })
        console.log("IF production")

        return {
            secretJSONWebToken: process.env.SECRET as string,
            serverRabbitMQ: process.env.AMQP_QUEUE_SERVER_ADDRESS as string,
            serverMySQL: process.env.DATABASE_URL as string,
            nodeAPI: process.env.nodeAPI as string,
            nodeConsumerCreateUpdateRegister: process.env.nodeConsumerCreateUpdateRegister as string,
            nodeConsumerCancelRegister: process.env.nodeConsumerCancelRegister as string,
            queueNameUpdateRegisterBD: process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
            queueNameCancelRegister: process.env.QUEUE_NAME_CANCEL_REGISTER as string,
            queueNameDeadCancel: process.env.QUEUE_NAME_DEAD_CANCEL as string,
        }


    } else {
        require('dotenv').config({ path: '../../../.env.test' })
        console.log("IF developer")

        return {
            secretJSONWebToken: process.env.SECRET as string,
            serverRabbitMQ: process.env.AMQP_QUEUE_SERVER_ADDRESS as string,
            serverMySQL: process.env.DATABASE_URL as string,
            nodeAPI: process.env.nodeAPI as string + "_developer",
            nodeConsumerCreateUpdateRegister: process.env.nodeConsumerCreateUpdateRegister as string + "_developer",
            nodeConsumerCancelRegister: process.env.nodeConsumerCancelRegister as string + "_developer",
            queueNameUpdateRegisterBD: process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD as string,
            queueNameCancelRegister: process.env.QUEUE_NAME_CANCEL_REGISTER as string,
            queueNameDeadCancel: process.env.QUEUE_NAME_DEAD_CANCEL as string,
        }
    }
}

export { ConnectionsName }