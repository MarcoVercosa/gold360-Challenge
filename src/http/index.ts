import Fastify from 'fastify'
import { RequestRegister } from "./routes/requestRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { PopulateBD } from './routes/populateBD'
import { RequestActiveRegister } from './routes/requestActiveRegister'


const fastifyServer = Fastify({
    logger: true
})
fastifyServer.register(RequestRegister) //create user account
fastifyServer.register(RequestCancelRegister) // request account desactivation
fastifyServer.register(RequestLogin) //login user
fastifyServer.register(PopulateBD) //popularBD Teste
fastifyServer.register(RequestActiveRegister) //popularBD Teste

const serverInit = async () => {
    try {
        await fastifyServer.listen(3000)
    } catch (err) {
        fastifyServer.log.error(err)
        process.exit(1)
    }
}
serverInit()