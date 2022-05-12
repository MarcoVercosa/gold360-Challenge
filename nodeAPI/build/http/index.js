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
async function CheckQueues() {
    await (0, checkIfAllQueuesIsCreated_1.CheckIfAllQueuesIsCreated)(); //Check if queue is already created, if not, create the queues
    //await CreateUsersRabbitMQ()//create users/passwords HabbitMQ
}
CheckQueues();
const fastifyServer = (0, fastify_1.default)({
    logger: false
});
fastifyServer.register(requestLogin_1.RequestLogin); //login user
fastifyServer.register(requestCreateUpdateRegister_1.RequestCreateUpdateRegister); //create/update user account
fastifyServer.register(requestCancelRegister_1.RequestCancelRegister); // request if account is enabled or disabled
fastifyServer.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
});
// const serverInit = async () => {
//     try {
//         await fastifyServer.listen(3000, "172.20.0.14")
//     } catch (err) {
//         fastifyServer.log.error(err)
//         process.exit(1)
//     }
// }
// serverInit()
fastifyServer.listen(3000, '0.0.0.0')
    .then((address) => console.log(`server listening on ${address}`))
    .catch(err => {
    console.log('Error starting server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map