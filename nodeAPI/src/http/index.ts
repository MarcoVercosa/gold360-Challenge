import Fastify from 'fastify'
import { RequestCreateUpdateRegister } from "./routes/requestCreateUpdateRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { CheckIfAllQueuesIsCreated } from '../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated'
import { CreateUsersRabbitMQ } from '../utils/createUsersRabbitMQ'


async function CheckQueues() {
    await CheckIfAllQueuesIsCreated()//Check if queue is already created, if not, create the queues
    //await CreateUsersRabbitMQ()//create users/passwords HabbitMQ
}
CheckQueues()

const fastifyServer = Fastify({
    logger: false
})

fastifyServer.register(RequestLogin) //login user
fastifyServer.register(RequestCreateUpdateRegister) //create/update user account
fastifyServer.register(RequestCancelRegister) // request if account is enabled or disabled

fastifyServer.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

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
        console.log('Error starting server:', err)
        process.exit(1)
    })