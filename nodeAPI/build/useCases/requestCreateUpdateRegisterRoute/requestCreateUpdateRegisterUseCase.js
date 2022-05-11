"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCreateUpdateRegisterUseCase = void 0;
const dotenv_1 = require("dotenv");
const uuid_1 = require("uuid");
const validateToken_1 = require("../../http/midwares/validateToken");
const createQueuesChannels_1 = require("../../services/queues/createQueuesChannels");
const requestCreateUpdateRegisterValidationInpunt_1 = require("./requestCreateUpdateRegisterValidationInpunt");
class RequestCreateUpdateRegisterUseCase {
    constructor() { }
    async CheckFirstQueueCreateUpdateRegisterBD() {
        (0, dotenv_1.config)();
        const isCreateQueue = await (0, createQueuesChannels_1.CreateQueue)(process.env.CREDENTIALS_REGISTER_USER, process.env.CREDENTIALS_REGISTER_PASS, process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD);
        return isCreateQueue;
    }
    async Execute({ token, fullName, email, password }) {
        //VALIDATE TOKEN
        let validateToken = (0, validateToken_1.ValidadeToken)(token);
        if (validateToken.auth) {
            //VALIDATE DE INPUTS
            let validateInputs = (0, requestCreateUpdateRegisterValidationInpunt_1.RequestCreateUpdateRegisterValidationInpunt)({ fullName, email, password });
            if (!validateInputs.sucess) {
                return { sucess: false, token, result: validateInputs.result };
            }
            //CENTRALIZE THE DATA AND SEND TO QUEUE
            let { firstNameValidate, fullNameValidate, emailValidate, passwordValidate } = validateInputs.result;
            let dataJSON = {
                validateToken,
                firstName: firstNameValidate,
                fullName: fullNameValidate,
                email: emailValidate,
                password: passwordValidate,
                comparatorKey: (0, uuid_1.v4)()
                //THIS KEY IS A COMPARISON STRING. UPON RECEIVING THE QUEUE CONFIRMATION, 
                //YOU WILL COMPARE THIS KEY WITH THE ONE RECEIVED. IF THE REQUEST KEY IS THE SAME
                // AS THE ONE RECEIVED FROM THE CONFIRMATION QUEUE, THEN IT IS INDEED THE REQUEST'S RESPONSE
            };
            //checks if queues is created and accessible
            const connectionQueueCreateUpdateRegisterBD = await this.CheckFirstQueueCreateUpdateRegisterBD();
            if (!connectionQueueCreateUpdateRegisterBD) {
                return { sucess: false, token: "", result: "Error to connect to RabbitMQ. Queue failed: create_update_register_bd / confirm_create_update_register_bd." };
            }
            //CREATE THE QUEUE TEMPORARY TO RECEIVE DE CONFIRMATION WITH DATAS. WHEN THE DATA CONFIRMATION IS RECEIVED, THE CONNECTION IS CLOSE E THE QUEUE TEMPORARY IS DELETED
            let rpc = await connectionQueueCreateUpdateRegisterBD.assertQueue('', { exclusive: true, durable: false });
            console.log("Create queue RPC temporary -- queue of return confirmation--  wit the name ", rpc);
            connectionQueueCreateUpdateRegisterBD.sendToQueue(process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD, Buffer.from(JSON.stringify(dataJSON)), { correlationId: dataJSON.comparatorKey, replyTo: rpc.queue });
            //SEND REQUEST UPDATE/CREATE REGISTER TO QUEUE
            //AFTER THE DATA IS SENT TO THE QUEUE. WE WILL REQUEST CONSUMPTION OF THE CONFIRMATION QUEUE (QUEUE TEMPORARY CREATE). 
            //WHERE IT WILL BE VALIDATED THROUGH THE COMPARISON KEY IF IT IS THE RESPONSE OF THE CURRENT REQUEST
            async function Return() {
                return new Promise((resolve, reject) => {
                    connectionQueueCreateUpdateRegisterBD.consume(rpc.queue, (data) => {
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
exports.RequestCreateUpdateRegisterUseCase = RequestCreateUpdateRegisterUseCase;
//# sourceMappingURL=requestCreateUpdateRegisterUseCase.js.map