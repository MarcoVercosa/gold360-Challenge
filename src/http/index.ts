import Fastify from 'fastify'
import { RequestRegister } from "./routes/requestRegister"
import { RequestCancelActiveRegister } from './routes/requestCancelActiveRegister'
import { RequestLogin } from "./routes/requestLogin"
import { PopulateBD } from './routes/_willRemovepopulateBD'
import { RequestActiveRegister } from './routes/_willRemoverequestActiveRegister'


const fastifyServer = Fastify({
    logger: false
})

fastifyServer.register(RequestLogin) //login user
fastifyServer.register(RequestRegister) //create user account
fastifyServer.register(RequestCancelActiveRegister) // request if account is enabled or disabled
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