"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCancelRegisterUseCase = void 0;
const createLogs_1 = require("../services/createLogs/createLogs");
const index_1 = require("../services/manageQueues/index");
class ConsumerCancelRegisterUseCase {
    constructor(consumerCancelRegisterRepository) {
        this.consumerCancelRegisterRepository = consumerCancelRegisterRepository;
        this.connectionQueue = null;
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }
    async ConnectAndConsume() {
        (0, index_1.ConnectAMQPQueueServe)()
            .then((data) => {
            let { channelOpen, connection } = data;
            connection.once("error", (error) => {
                createLogs_1.Logger.error(`Rabbitmq => ERROR DETECTED TO CREATE CONNECTION and consumed queue -- ${error} -- New try in 5 secs`);
                setTimeout(() => {
                    connection.close();
                    channelOpen.close();
                    this.ConnectAndConsume();
                }, 5000);
            });
            connection.once("close", (error) => {
                createLogs_1.Logger.error(`Rabbitmq => CLOSE DETECTED IN CONNECTION ALREADY CREATED -- ${error} -- New try in 5 secs`);
                setTimeout(() => {
                    connection.close();
                    channelOpen.close();
                    this.ConnectAndConsume();
                }, 5000);
            });
            this.connectionQueue = channelOpen;
            this.Consume(); // ====>  Call Consumer
        }).catch((error) => {
            this.connectionQueue;
            createLogs_1.Logger.error(`SOMETHING WRONG HAPPENED HERE TO CONNECT RABBITMQ -- ${error} New try in 5 secs`);
            setTimeout(() => {
                this.ConnectAndConsume();
            }, 2000);
        });
    }
    async Consume() {
        if (this.connectionQueue) {
            this.connectionQueue.consume(process.env.QUEUE_NAME_CANCEL_REGISTER, async (reply) => {
                let { replyTo, correlationId } = reply.properties;
                let dataConsume = JSON.parse(reply.content); ///change from  buffer to object
                createLogs_1.Logger.info(`Rabbitmq => [XXXX] The Consumer to ${process.env.QUEUE_NAME_CANCEL_REGISTER} received data.`);
                let result = await this.Execute(dataConsume);
                //reply the confirmation with data to queue temporary
                this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), { correlationId });
                this.connectionQueue.ack(reply);
                createLogs_1.Logger.info(`Rabbitmq => [XXXX] The confirmation to  ${process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD} was sent.`);
            }, { noAck: false } //avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            );
        }
    }
    async Execute(dataQueueConsumed) {
        console.log(dataQueueConsumed);
        try {
            let isAdmin = await this.consumerCancelRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName });
            if (!isAdmin) {
                return { sucess: true, comparatorKey: "", message: "Permission denied" };
            }
            //cancel if is not admin
            //Check if user is active in BD
            let checkIfIsActiveRegisteBD = await this.consumerCancelRegisterRepository.CheckIfIsActiveRepository({
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
            });
            if (checkIfIsActiveRegisteBD.length > 0) {
                //If Register is  enabled so change to disable
                if (checkIfIsActiveRegisteBD[0]?.active) {
                    let result = await this.consumerCancelRegisterRepository.CancelRegisterRepository({
                        fullName: dataQueueConsumed.fullName,
                        email: dataQueueConsumed.email,
                    });
                    if (result > 0) {
                        return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register changed to Disabled" };
                    }
                }
                //If Register is already disable in the bd. Don't do anything in BD and send to queue dead
                if (!checkIfIsActiveRegisteBD[0].active) {
                    let result = {
                        sucess: true,
                        data: {
                            fullName: dataQueueConsumed.fullName,
                            email: dataQueueConsumed.email
                        },
                        result: "Register is already disabled. There was no change in DataBase. Sent to queue dead."
                    };
                    let channel = await (0, index_1.ConnectCancelDeadQueue)();
                    channel.sendToQueue(process.env.QUEUE_NAME_DEAD_CANCEL, Buffer.from(JSON.stringify(result)));
                    return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register is already disabled. There was no change in DataBase. Sent to Queue Dead" };
                }
            }
            else {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "FullName or/and email not found" };
            }
        }
        catch (error) {
            createLogs_1.Logger.error(`REPOSITORY => SOMETHING WRONG HAPPENED HERE -- ${error}`);
            return { sucess: true, comparatorKey: "", message: error };
        }
    }
}
exports.ConsumerCancelRegisterUseCase = ConsumerCancelRegisterUseCase;
//# sourceMappingURL=consumerCancelRegisterUseCase.js.map