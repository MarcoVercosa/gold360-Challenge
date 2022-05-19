"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const requestCreateUpdateRegister_1 = require("./routes/requestCreateUpdateRegister");
const requestCancelRegister_1 = require("./routes/requestCancelRegister");
const requestLogin_1 = require("./routes/requestLogin");
const checkIfAllQueuesIsCreated_1 = require("../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated");
const createLogs_1 = require("../services/createLogs/createLogs");
async function StartServer() {
    console.log(`Server NODEAPI  is starting on mode ${process.env.NODE_ENV}`);
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
    fastifyServer.listen(3000, '0.0.0.0') //'0.0.0.0' is the best conf to docker
        .then((address) => createLogs_1.Logger.http(`HTTP => SERVER started and listening on ${address} o process ${process.pid}`))
        .catch(error => {
        createLogs_1.Logger.error(`HTTP => ERROR starting server: ${error}`);
        process.exit(1);
    });
    process.on("SIGTERM", () => {
        createLogs_1.Logger.error(`ERROR => SIGTERM, the ${process.pid} is kill`);
        fastifyServer.close().then(() => {
            createLogs_1.Logger.warn(` ALERT => SIGTERM - fastifyServer successfully closed!`);
            //se houver alguma requisição para encerrar o Node, o Fastify vai solicitar aguardar as respostas para encerrar
            process.exit(1);
        }, (error) => {
            createLogs_1.Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`);
        });
    });
    process.on("SIGINT", () => {
        createLogs_1.Logger.error(`ERROR => SIGINT, the ${process.pid} is kill`);
        fastifyServer.close().then(() => {
            createLogs_1.Logger.alert(`ALERT => SIGINT - fastifyServer successfully closed!`);
            process.exit(1);
        }, (error) => {
            createLogs_1.Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`);
        });
    });
}
exports.StartServer = StartServer;
//# sourceMappingURL=index.js.map