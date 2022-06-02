"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartServerClass = void 0;
const fastify_1 = __importDefault(require("fastify"));
const requestCreateUpdateRegister_1 = require("./routes/requestCreateUpdateRegister");
const requestCancelRegister_1 = require("./routes/requestCancelRegister");
const requestLogin_1 = require("./routes/requestLogin");
const checkIfAllQueuesIsCreated_1 = require("../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated");
const createLogs_1 = require("../services/createLogs/createLogs");
const documentation_1 = require("../doc/documentation");
class StartServerClass {
    constructor() {
        this.fastifyServer = (0, fastify_1.default)({
            logger: false
        });
    }
    async CheckQueues() {
        let result = await (0, checkIfAllQueuesIsCreated_1.CheckIfAllQueuesIsCreated)();
        return result;
    }
    RegisterRoutesAndConfig() {
        this.fastifyServer.register(require('@fastify/cors'), {
            origin: "*", method: ["GET", "POST"]
        });
        this.fastifyServer.register(requestLogin_1.RequestLogin); //login user
        this.fastifyServer.register(requestCreateUpdateRegister_1.RequestCreateUpdateRegister); //create/update user account
        this.fastifyServer.register(requestCancelRegister_1.RequestCancelRegister); // request if account is enabled or disabled
        return true;
    }
    async StartHTTP() {
        this.fastifyServer.listen(3000, '0.0.0.0') //'0.0.0.0' is the best conf to docker
            .then((address) => createLogs_1.Logger.info(`HTTP => SERVER started and listening on ${address} o process ${process.pid}`))
            .catch(error => {
            createLogs_1.Logger.error(`HTTP => ERROR starting server: ${error}`);
            process.exit(1);
        });
    }
    ShutdownNegociation() {
        process.on("SIGTERM", () => {
            createLogs_1.Logger.error(`ERROR => SIGTERM, the ${process.pid} is kill`);
            this.fastifyServer.close().then(() => {
                createLogs_1.Logger.warn(` ALERT => SIGTERM - fastifyServer successfully closed!`);
                //se houver alguma requisição para encerrar o Node, o Fastify vai solicitar aguardar as respostas para encerrar
                process.exit(1);
            }, (error) => {
                createLogs_1.Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`);
            });
        });
        process.on("SIGINT", () => {
            createLogs_1.Logger.error(`ERROR => SIGINT, the ${process.pid} is kill`);
            this.fastifyServer.close().then(() => {
                createLogs_1.Logger.alert(`ALERT => SIGINT - fastifyServer successfully closed!`);
                process.exit(1);
            }, (error) => {
                createLogs_1.Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`);
            });
        });
    }
    async Execute() {
        console.log(`Server NODEAPI  is starting on mode "" ${process.env.NODE_ENV}" `);
        createLogs_1.Logger.warn(`Server NODEAPI  is starting on mode "" ${process.env.NODE_ENV} ""`);
        await this.CheckQueues(); //FIRST - CHECK IF QUEUE IS ALREADY CREATED, IF NOT, CREATE THE QUEUES
        try {
            this.RegisterRoutesAndConfig(); //REGISTER ROUTES
            await this.StartHTTP(); //START HTTP SERVER WITH ROUTES REGISTERS
            (0, documentation_1.StartDocumentationSwagger)(); //START DOCUMENTATION IF NOT PRODUCTION (SWAGGER) ON PORT 3030
            this.ShutdownNegociation(); //If one process crashes, Node will try to start another one. Keeping the server UP as much as possible
            return this.fastifyServer; //this return is for tests modules
        }
        catch (error) {
            createLogs_1.Logger.error(`ERROR => ERROR WHILE ATTEMPTING TO START THE SERVER: ${error}`);
            return false;
        }
    }
}
exports.StartServerClass = StartServerClass;
//# sourceMappingURL=index.js.map