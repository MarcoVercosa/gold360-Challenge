import Fastify from 'fastify'
import { RequestCreateUpdateRegister } from "./routes/requestCreateUpdateRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { CheckIfAllQueuesIsCreated } from '../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated'
import { Logger } from '../services/createLogs/createLogs'
import { StartDocumentation } from "../doc/documentation"

async function StartServer() {

    console.log(`Server NODEAPI  is starting on mode "" ${process.env.NODE_ENV} " `)
    Logger.warn(`Server NODEAPI  is starting on mode "" ${process.env.NODE_ENV} ""`);

    await CheckIfAllQueuesIsCreated()//Check if queue is already created, if not, create the queues
    StartDocumentation() //start documentation IF NOT PRODUCTION (SWAGGER) on port 3001 


    const fastifyServer = Fastify({
        logger: false
    })

    fastifyServer.register(RequestLogin) //login user
    fastifyServer.register(RequestCreateUpdateRegister) //create/update user account
    fastifyServer.register(RequestCancelRegister) // request if account is enabled or disabled

    fastifyServer.listen(3000, '0.0.0.0') //'0.0.0.0' is the best conf to docker
        .then((address) =>
            Logger.info(`HTTP => SERVER started and listening on ${address} o process ${process.pid}`)
        )
        .catch(error => {
            Logger.error(`HTTP => ERROR starting server: ${error}`)
            process.exit(1)
        }
        )

    process.on("SIGTERM", () => {
        Logger.error(`ERROR => SIGTERM, the ${process.pid} is kill`)
        fastifyServer.close().then(() => {
            Logger.warn(` ALERT => SIGTERM - fastifyServer successfully closed!`)
            //se houver alguma requisição para encerrar o Node, o Fastify vai solicitar aguardar as respostas para encerrar
            process.exit(1)
        }, (error) => {
            Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`)
        })

    })
    process.on("SIGINT", () => {
        Logger.error(`ERROR => SIGINT, the ${process.pid} is kill`)

        fastifyServer.close().then(() => {
            Logger.alert(`ALERT => SIGINT - fastifyServer successfully closed!`)
            process.exit(1)
        }, (error) => {
            Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`)
        })
    })

    return fastifyServer
}
export { StartServer }