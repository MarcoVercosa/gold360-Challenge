"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCreateUpdateRegisterUseCase = void 0;
const createLogs_1 = require("../../services/createLogs/createLogs");
const manageQueues_1 = require("../../services/manageQueues");
const connections_1 = require("../../services/connections");
class ConsumerCreateUpdateRegisterUseCase {
    constructor(consumerCreateUpdateRegisterRepository) {
        this.consumerCreateUpdateRegisterRepository = consumerCreateUpdateRegisterRepository;
        this.connectionQueue = null;
        //store the conection use by consume register queue bd and  by send confirm queue. 
        //Is used to send data and keep only connection. Avoiding leaving connections and channels open
        //is greate to execute the consume lister connection once
    }
    async ConnectAndConsume() {
        try {
            let { channelOpen, connection } = await (0, manageQueues_1.ConnectAMQPQueueServe)();
            connection.once("error", (error) => {
                createLogs_1.Logger.error(`Rabbitmq => ERROR DETECTED TO CREATE CONNECTION and consumed queue -- ${error} -- New try in 5 secs`);
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
            //         try {
            //             // connection.close()
            //             // channelOpen.close()
            //             console.log("Rabbitmq => WARN  Devido ao Evento 'CLOSE' detectado as conexões foram  encerradas e tentaremos uma nova")
            //             this.ConnectAndConsume()
            //         } catch (err) {
            //             console.log(`Tentamos encerrar as coneções devido ao evento 'CLOSE', mas ocorreu a falha: ${err} - Tentaremos uma nova`)
            //             this.ConnectAndConsume()
            //         }
            //     }, 5000)
            // })
            this.connectionQueue = channelOpen;
            this.Consume();
        }
        catch (error) {
            createLogs_1.Logger.error(`SOMETHING WRONG HAPPENED HERE TO CONNECT RABBITMQ -- ${error} New try in 5 secs`);
            setTimeout(() => {
                this.ConnectAndConsume();
            }, 5000);
        }
    }
    async Consume() {
        let connections = (0, connections_1.ConnectionsName)();
        if (this.connectionQueue) {
            this.connectionQueue.consume(connections.queueNameCreateUpdateRegisterBD, async (reply) => {
                let { replyTo, correlationId } = reply.properties;
                let dataConsume = JSON.parse(reply.content); ///change from  buffer to object
                createLogs_1.Logger.info(`Rabbitmq => [XXXX] The Consumer to ${connections.queueNameCreateUpdateRegisterBD} received data.`);
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
        try {
            let isAdmin = await this.consumerCreateUpdateRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName });
            if (!isAdmin) {
                return { sucess: false, comparatorKey: "", message: "Permission denied" };
            }
            //cancel if is not admin
            let resultBD = await this.consumerCreateUpdateRegisterRepository.RequestRegisterCreateUpdateRepository({
                firstName: dataQueueConsumed.firstName,
                fullName: dataQueueConsumed.fullName,
                email: dataQueueConsumed.email,
                password: dataQueueConsumed.password,
                lastUpDateBy: dataQueueConsumed.fullName
            });
            if (resultBD == 0) {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" };
            }
            if (resultBD == 1) {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" };
            }
            if (resultBD == 2) {
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" };
            }
        }
        catch (error) {
            createLogs_1.Logger.error(`REPOSITORY => SOMETHING WRONG HAPPENED HERE -- ${error}`);
            return { sucess: true, comparatorKey: "", message: error };
        }
    }
}
exports.ConsumerCreateUpdateRegisterUseCase = ConsumerCreateUpdateRegisterUseCase;
//# sourceMappingURL=consumerCreateUpdateRegisterUseCase.js.map