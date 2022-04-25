import Fastify from 'fastify'
import { RequestRegister } from "./routes/requestRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { PopulateBD } from './routes/populateBD'
import { RequestActiveRegister } from './routes/requestActiveRegister'


const fastifyServer = Fastify({
    logger: true
})

fastifyServer.register(RequestLogin) //login user
fastifyServer.register(RequestRegister) //create user account
fastifyServer.register(RequestCancelRegister) // request account desactivation
fastifyServer.register(RequestActiveRegister) //Activar

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