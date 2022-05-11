"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelRegisterUseCase = void 0;
const dotenv_1 = require("dotenv");
const uuid_1 = require("uuid");
const validateToken_1 = require("../../http/midwares/validateToken");
const createQueuesChannels_1 = require("../../services/queues/createQueuesChannels");
const RequestCancelValidationInpunt_1 = require("./RequestCancelValidationInpunt");
class RequestCancelRegisterUseCase {
    constructor(
    //private requestCancelActiveRegisterRepository: IRequestCancelActiveRegisterRepository
    ) { }
    async CheckFirstQueueCancelRegisterBD() {
        (0, dotenv_1.config)();
        //create queue (if not exists), conection and channel 
        const connectionQueueCancelRegisterBD = await (0, createQueuesChannels_1.CreateQueue)(process.env.CREDENTIALS_CANCEL_USER, process.env.CREDENTIALS_CANCEL_PASS, process.env.QUEUE_NAME_CANCEL_REGISTER);
        const connectionQueueCancelDead = await (0, createQueuesChannels_1.CreateQueue)(process.env.CREDENTIALS_DEAD_QUEUE_USER, process.env.CREDENTIALS_DEAD_QUEUE_PASS, process.env.QUEUE_NAME_DEAD_CANCEL);
        return { connectionQueueCancelRegisterBD, connectionQueueCancelDead };
    }
    async Execute({ token, fullName, email }) {
        (0, dotenv_1.config)();
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
            console.log("Create queue RPC temporary -- queue of return confirmation--  with the name ", rpc);
            connectionQueueCancelRegisterBD.sendToQueue(process.env.QUEUE_NAME_CANCEL_REGISTER, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue });
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE
            //AFTER THE DATA IS SENT TO THE QUEUE. IN THE RETURN OF THE FUNCTION WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
            //WHERE IT WILL BE VALIDATED THROUGH THE COMPARISON KEY IF IT IS THE RESPONSE OF THE CURRENT REQUEST
            async function Return() {
                return new Promise((resolve, reject) => {
                    connectionQueueCancelRegisterBD.consume(rpc.queue, (data) => {
                        console.log("confirmação recebida da fila ", rpc.queue);
                        if (data.properties.correlationId == dataJSON.comparatorKey) {
                            console.log("recebido confirmação ", JSON.parse(data.content));
                            resolve(JSON.parse(data.content));
                        }
                    });
                }).catch((err) => {
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