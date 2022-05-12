"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCreateUpdateRegisterUseCase = void 0;
const manageQueues_1 = require("../../services/manageQueues");
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
                console.log("Error detected on connection.We try again in 2 secs", error);
                setTimeout(() => {
                    connection.close();
                    channelOpen.close();
                    this.ConnectAndConsume();
                }, 2000);
            });
            connection.once("close", (error) => {
                console.log("CLOSE detected on connection.We try again in 2 secs", error);
                setTimeout(() => {
                    connection.close();
                    channelOpen.close();
                    this.ConnectAndConsume();
                }, 2000);
            });
            this.connectionQueue = channelOpen;
            this.Consume();
        }
        catch (err) {
            console.log("Something wrong happened here. We try again in 2 secs", err.connection.cause);
            setTimeout(() => {
                this.ConnectAndConsume();
            }, 2000);
        }
    }
    async Consume() {
        if (this.connectionQueue) {
            this.connectionQueue.consume(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD, async (reply) => {
                console.log(reply);
                let { replyTo, correlationId } = reply.properties;
                let dataConsume = JSON.parse(reply.content); ///change from  buffer to object
                console.log(" [XXXX] The server received data");
                let result = await this.Execute(dataConsume);
                //reply the confirmation with data to queue temporary
                this.connectionQueue.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), { correlationId });
                this.connectionQueue.ack(reply);
                console.log(" [XXXX] The server sent a data");
            }, { noAck: false } //avisa que a confirmação será feita manualmente(feita na linha acima -- this.connectionQueue.ack(reply))
            );
        }
    }
    async Execute(dataQueueConsumed) {
        console.log(dataQueueConsumed);
        try {
            let isAdmin = await this.consumerCreateUpdateRegisterRepository.UserIsAdminConfirm({ idToken: dataQueueConsumed.validateToken.result.id, fullNameToken: dataQueueConsumed.validateToken.result.fullName });
            if (!isAdmin) {
                return { sucess: true, comparatorKey: "", message: "Permission denied" };
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
                console.log({ sucess: true, result: "The Register is NOT MODIFIELD" });
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "The Register is NOT MODIFIELD" };
            }
            if (resultBD == 1) {
                console.log({ sucess: true, result: "Register CREATED successfully" });
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register CREATED successfully" };
            }
            if (resultBD == 2) {
                console.log({ sucess: true, result: "Register UPDATED successfully" });
                return { sucess: true, comparatorKey: dataQueueConsumed.comparatorKey, message: "Register UPDATED successfully" };
            }
        }
        catch (err) {
            console.log(err);
            return { sucess: true, comparatorKey: "", message: err };
        }
    }
}
exports.ConsumerCreateUpdateRegisterUseCase = ConsumerCreateUpdateRegisterUseCase;
//# sourceMappingURL=consumerCreateUpdateRegisterUseCase.js.map