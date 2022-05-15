import Fastify from 'fastify'
import { RequestCreateUpdateRegister } from "./routes/requestCreateUpdateRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { CheckIfAllQueuesIsCreated } from '../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated'
import { Logger } from '../services/createLogs/createLogs'
import OS from "os"

Logger.info(`Server is starting on mode ${process.env.NODE_ENV}`);

async function CheckQueues() {
    await CheckIfAllQueuesIsCreated()//Check if queue is already created, if not, create the queues
}
CheckQueues()

const fastifyServer = Fastify({
    logger: false
})




fastifyServer.register(RequestLogin) //login user
fastifyServer.register(RequestCreateUpdateRegister) //create/update user account
fastifyServer.register(RequestCancelRegister) // request if account is enabled or disabled


fastifyServer.listen(3000, '0.0.0.0')
    .then((address) => Logger.http(`HTTP => Server listening on ${address}`))
    .catch(err => {
        console.log(`Origin log: ${OS.hostname()} => Error starting server:`, err)
        process.exit(1)
    })