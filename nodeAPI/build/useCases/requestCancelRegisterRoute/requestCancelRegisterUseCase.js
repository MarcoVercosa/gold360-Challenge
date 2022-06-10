"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelRegisterUseCase = void 0;
const connections_1 = require("../../services/connections");
const uuid_1 = require("uuid");
const validateToken_1 = require("../../http/midwares/validateToken");
const createLogs_1 = require("../../services/createLogs/createLogs");
const createQueuesChannels_1 = require("../../services/queues/createQueuesChannels");
const RequestCancelValidationInpunt_1 = require("./RequestCancelValidationInpunt");
class RequestCancelRegisterUseCase {
    constructor(
    //private requestCancelActiveRegisterRepository: IRequestCancelActiveRegisterRepository
    ) { }
    async CheckFirstQueueCancelRegisterBD() {
        let connections = (0, connections_1.ConnectionsName)();
        //create queue (if not exists), conection and channel 
        const connectionQueueCancelRegisterBD = await (0, createQueuesChannels_1.CreateQueue)(connections.credentialsCancelUser, connections.credentialsCancelPass, connections.queueNameCancelRegister);
        const connectionQueueCancelDead = await (0, createQueuesChannels_1.CreateQueue)(connections.credentialsDeadQueueUser, connections.credentialsDeadQueuePass, connections.queueNameDeadCancel);
        return { connectionQueueCancelRegisterBD, connectionQueueCancelDead };
    }
    async Execute({ token, fullName, email }) {
        let connections = (0, connections_1.ConnectionsName)();
        //check validate token
        let validateToken = (0, validateToken_1.ValidadeToken)(token);
        if (validateToken.auth) {
            //VALIDATE THE INPUTS
            let validateInputs = (0, RequestCancelValidationInpunt_1.RequestCancelValidationInpunt)({ fullName, email });
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result };
            }
            //CENTRALIZE THE DATA AND SEND TO QUEUE
            let { fullNameValidate, emailValidate } = validateInputs.result;
            let dataJSON = {
                validateToken,
                fullName: fullNameValidate,
                email: emailValidate,
                comparatorKey: (0, uuid_1.v4)()
                //THIS KEY IS A COMPARISON STRING. UPON RECEIVING THE QUEUE CONFIRMATION, 
                //YOU WILL COMPARE THIS KEY WITH THE ONE RECEIVED. IF THE REQUEST KEY IS THE SAME
                // AS THE ONE RECEIVED FROM THE CONFIRMATION QUEUE, THEN IT IS INDEED THE REQUEST'S RESPONSE
            };
            //checks if queues is created and accessible
            const { connectionQueueCancelRegisterBD, connectionQueueCancelDead } = await this.CheckFirstQueueCancelRegisterBD();
            if (!connectionQueueCancelRegisterBD || !connectionQueueCancelDead) {
                return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: Cancel queue  || Dead Cancel Queue" };
            }
            //CREATE THE QUEUE TEMPORARY TO RECEIVE DE CONFIRMATION WITH DATAS. WHEN THE DATA CONFIRMATION IS RECEIVED, THE CONNECTION IS CLOSE E THE QUEUE TEMPORARY IS DELETED
            let rpc = await connectionQueueCancelRegisterBD.assertQueue('', { exclusive: true, durable: false });
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE (replyTo => It is the queue temporary above created than response will be send) 
            connectionQueueCancelRegisterBD.sendToQueue(connections.queueNameCancelRegister, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue });
            //AFTER THE DATA IS SENT TO THE QUEUE. IN THE RETURN OF THE FUNCTION WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
            //WHERE IT WILL BE VALIDATED THROUGH THE COMPARISON KEY IF IT IS THE RESPONSE OF THE CURRENT REQUEST
            async function Return() {
                return new Promise((resolve, reject) => {
                    connectionQueueCancelRegisterBD.consume(rpc.queue, (data) => {
                        if (data.properties.correlationId == dataJSON.comparatorKey) {
                            createLogs_1.Logger.info(`RABBITMQ => Data received e confirmed -- queue name: ${connections.queueNameCreateUpdateRegisterBD} -- from queue name temporary: ${rpc.queue} `);
                            resolve(JSON.parse(data.content));
                        }
                    });
                }).catch((err) => {
                    createLogs_1.Logger.error(`RABBITMQ => error on consume queue temporary: ${rpc.queue} -- queue request:${connections.queueNameCreateUpdateRegisterBD} -- error: ${err}`);
                    return err;
                });
            }
            return { sucess: true, token, result: await Return() };
        }
        else {
            return { sucess: false, token, result: "Token invalid" };
        }
    }
}
exports.RequestCancelRegisterUseCase = RequestCancelRegisterUseCase;
//# sourceMappingURL=requestCancelRegisterUseCase.js.map