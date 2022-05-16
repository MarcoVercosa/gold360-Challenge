"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const requestCreateUpdateRegister_1 = require("./routes/requestCreateUpdateRegister");
const requestCancelRegister_1 = require("./routes/requestCancelRegister");
const requestLogin_1 = require("./routes/requestLogin");
const checkIfAllQueuesIsCreated_1 = require("../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated");
const createLogs_1 = require("../services/createLogs/createLogs");
const os_1 = __importDefault(require("os"));
createLogs_1.Logger.warn(`Server NODEAPI  is starting on mode ${process.env.NODE_ENV}`);
async function CheckQueues() {
    await (0, checkIfAllQueuesIsCreated_1.CheckIfAllQueuesIsCreated)(); //Check if queue is already created, if not, create the queues
}
CheckQueues();
const fastifyServer = (0, fastify_1.default)({
    logger: false
});
fastifyServer.register(requestLogin_1.RequestLogin); //login user
fastifyServer.register(requestCreateUpdateRegister_1.RequestCreateUpdateRegister); //create/update user account
fastifyServer.register(requestCancelRegister_1.RequestCancelRegister); // request if account is enabled or disabled
fastifyServer.listen(3000, '0.0.0.0') //0.0.0.0 is the best conf to docker
    .then((address) => createLogs_1.Logger.http(`HTTP => Server started and listening on ${address}`))
    .catch(err => {
    console.log(`Origin log: ${os_1.default.hostname()} => Error starting server:`, err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map