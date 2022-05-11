import Fastify from 'fastify'
import { RequestCreateUpdateRegister } from "./routes/requestCreateUpdateRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { PopulateBD } from './routes/_willRemovepopulateBD'
import { RequestActiveRegister } from './routes/_willRemoverequestActiveRegister'
import { CheckIfAllQueuesIsCreated } from '../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated'
import { CreateUsersRabbitMQ } from '../utils/createUsersRabbitMQ'


async function CheckQueues() {
    //Check if queue is already created, if not, create the queues
    let checkQueues = await CheckIfAllQueuesIsCreated()
    if (!checkQueues.sucess) {
        console.log(checkQueues.message)
    }
    await CreateUsersRabbitMQ()//create users/passwords HabbitMQ
}
CheckQueues()

const fastifyServer = Fastify({
    logger: false
})

fastifyServer.register(RequestLogin) //login user
fastifyServer.register(RequestCreateUpdateRegister) //create/update user account
fastifyServer.register(RequestCancelRegister) // request if account is enabled or disabled
//fastifyServer.register(RequestActiveRegister) //Activar

//fastifyServer.register(canceled) //Route to show registers canceled or active

fastifyServer.register(PopulateBD) //popularBD Teste

const serverInit = async () => {
    try {
        await fastifyServer.listen(3000)
    } catch (err) {
        fastifyServer.log.error(err)
        process.exit(1)
    }
}
serverInit()