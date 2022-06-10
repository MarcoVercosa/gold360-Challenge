"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCancelRegisterUseCase = void 0;
const createLogs_1 = require("../services/createLogs/createLogs");
const index_1 = require("../services/manageQueues/index");
const index_2 = require("../services/connections/index");
class ConsumerCancelRegisterUseCase {
    constructor(consumerCancelRegisterRepository) {
        this.consumerCancelRegisterRepository = consumerCancelRegisterRepository;
        this.connectionQueue = null;
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }
    async ConnectAndConsume() {
        (0, index_1.ConnectAMQPQueueServer)()
            .then((data) => {
            let { channelOpen, connection } = data;
            connection.once("error", (error) => {
                createLogs_1.Logger.error(`Rabbitmq => ERROR DETECTED TO CREATE CONNECTION and consume queue -- ${error} -- New try in 5 secs`);
                setTimeout(() => {
                    try {
                        connection.close();
                        channelOpen.close();
                        createLogs_1.Logger.warn((`Rabbitmq => WARN  Due to the event, identified as an 'ERROR' were terminated and we will try again`));
                        this.ConnectAndConsume();
                    }
                    catch (err) {
                        createLogs_1.Logger.error(`We tried to close the connections due to the ERROR event, but the failure occurred: ${err} - we try again another conection`);
                        this.ConnectAndConsume();
                    }
                }, 5000);
            });
            // connection.once("close", (error: any) => {
            //     Logger.error(`Rabbitmq => CLOSE DETECTED IN CONNECTION ALREADY CREATED -- ${error} -- New try in 5 secs`)
            //     setTimeout(() => {
            //         connection.close()
            //         channelOpen.close()
            //         this.ConnectAndConsume()
            //     }, 5000)
            // })
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
        let connections = (0, index_2.ConnectionsName)();
        if (this.connectionQueue) {
            this.connectionQueue.consume(connections.queueNameCancelRegister, async (reply) => {
                let { replyTo, correlationId } = reply.properties;
                let dataConsume = JSON.parse(reply.content); ///change from  buffer to object
                createLogs_1.Logger.info(`Rabbitmq => [XXXX] The Consumer to ${connections.queueNameCancelRegister} received data.`);
                let result = await this.Execute(dataConsume);
                //reply the confirmation with data to queue temporary
                this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), { correlationId });
                this.connectionQueue.ack(reply);
                createLogs_1.Logger.info(`Rabbitmq => [XXXX] The confirmation to  ${connections.queueNameCreateUpdateRegisterBD} was sent.`);
            }, { noAck: false } //avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            );
        }
    }
    async Execute(dataQueueConsumed) {
        let connections = (0, index_2.ConnectionsName)();
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
            //if email or passowrd not match in BD
            if (checkIfIsActiveRegisteBD.length < 1) {
                return { sucess: false, comparatorKey: dataQueueConsumed.comparatorKey, message: "FullName or/and email not found" };
            }
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
            if (!checkIfIsActiveRegisteBD[0]?.active) {
                let result = {
                    sucess: false,
                    data: {
                        fullName: dataQueueConsumed.fullName,
                        email: dataQueueConsumed.email
                    },
                    result: "Register is already disabled. There was no change in DataBase. Sent to queue dead."
                };
                let channel = await (0, index_1.ConnectCancelDeadQueue)();
                channel.sendToQueue(connections.queueNameDeadCancel, Buffer.from(JSON.stringify(result)));
                return { sucess: false, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register is already disabled. There was no change in DataBase. Sent to Queue Dead" };
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