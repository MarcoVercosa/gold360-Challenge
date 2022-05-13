import Fastify from 'fastify'
import { RequestCreateUpdateRegister } from "./routes/requestCreateUpdateRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { CheckIfAllQueuesIsCreated } from '../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated'
import { CreateUsersRabbitMQ } from '../utils/createUsersRabbitMQ'
import { Logger } from '../services/createLogs/createLogs'


async function CheckQueues() {
    await CheckIfAllQueuesIsCreated()//Check if queue is already created, if not, create the queues
    //await CreateUsersRabbitMQ()//create users/passwords HabbitMQ
}
CheckQueues()

const fastifyServer = Fastify({
    logger: false
})

console.log(process.env.NODE_ENV)
console.log(process.env.NODE_ENV)
console.log(process.env.NODE_ENV)


fastifyServer.register(RequestLogin) //login user
fastifyServer.register(RequestCreateUpdateRegister) //create/update user account
fastifyServer.register(RequestCancelRegister) // request if account is enabled or disabled

fastifyServer.get('/', function (request, reply) {
    Logger.error("This is an error log");
    Logger.warn("This is a warn log");
    Logger.info("This is a info log");
    Logger.http("This is a http log");
    Logger.debug("This is a debug log");
})


fastifyServer.listen(3000, '0.0.0.0')
    .then((address) => Logger.http(`server listening on ${address}`))
    .catch(err => {
        console.log('Error starting server:', err)
        process.exit(1)
    })