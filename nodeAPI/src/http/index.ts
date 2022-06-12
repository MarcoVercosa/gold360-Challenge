import Fastify, { FastifyInstance } from 'fastify'
import { RequestCreateUpdateRegister } from "./routes/requestCreateUpdateRegister"
import { RequestCancelRegister } from './routes/requestCancelRegister'
import { RequestLogin } from "./routes/requestLogin"
import { CheckIfAllQueuesIsCreated } from '../services/queues/checkIfAllQueuesIsCreated/checkIfAllQueuesIsCreated'
import { Logger } from '../services/createLogs/createLogs'
import { StartDocumentationSwagger } from "../doc/documentation"
import { IStartServerClass } from "../entities/configAndStartServer/IStartServerClass"
import { FindUserDefaultAlreadyExists } from '../repositories/createDefaultUserBD/createDefaultUserBD'


class StartServerClass implements IStartServerClass {

    fastifyServer: FastifyInstance

    constructor() {
        this.fastifyServer = Fastify({
            logger: false
        })
    }
    async CheckQueues(): Promise<boolean | void> {
        let result: boolean | void = await CheckIfAllQueuesIsCreated()
        return result
    }
    RegisterRoutesAndConfig(): boolean {
        this.fastifyServer.register(require('@fastify/cors'), {
            origin: "*", method: ["GET", "POST"]
        })
        this.fastifyServer.register(RequestLogin) //login user
        this.fastifyServer.register(RequestCreateUpdateRegister) //create/update user account
        this.fastifyServer.register(RequestCancelRegister) // request if account is enabled or disabled
        return true
    }
    async CreateUserDefaultOperatorBD(): Promise<void> {
        const check = new FindUserDefaultAlreadyExists()
        await check.findUserDefaultAlreadyExists()
    }
    async StartHTTP(): Promise<void> {
        this.fastifyServer.listen(3000, '0.0.0.0') //'0.0.0.0' is the best conf to docker
            .then((address) =>
                Logger.info(`HTTP => SERVER started and listening on ${address} o process ${process.pid}`)
            )
            .catch(error => {
                Logger.error(`HTTP => ERROR starting server: ${error}`)
                process.exit(1)
            }
            )
    }
    ShutdownNegociation() {
        process.on("SIGTERM", () => {
            Logger.error(`ERROR => SIGTERM, the ${process.pid} is kill`)
            this.fastifyServer.close().then(() => {
                Logger.warn(` ALERT => SIGTERM - fastifyServer successfully closed!`)
                //se houver alguma requisição para encerrar o Node, o Fastify vai solicitar aguardar as respostas para encerrar
                process.exit(1)
            }, (error) => {
                Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`)
            })

        })
        process.on("SIGINT", () => {
            Logger.error(`ERROR => SIGINT, the ${process.pid} is kill`)

            this.fastifyServer.close().then(() => {
                Logger.alert(`ALERT => SIGINT - fastifyServer successfully closed!`)
                process.exit(1)
            }, (error) => {
                Logger.error(`ERROR => SIGTERM - Attempt to terminate fastify executed with error ! --  Error: ${error}`)
            })
        })
    }
    async Execute(): Promise<FastifyInstance | boolean> {
        console.log(`Server NODEAPI  is starting on mode "" ${process.env.NODE_ENV}" `)
        Logger.warn(`Server NODEAPI  is starting on mode "" ${process.env.NODE_ENV} ""`);

        await this.CheckQueues()//FIRST - CHECK IF QUEUE IS ALREADY CREATED, IF NOT, CREATE THE QUEUES
        try {
            this.RegisterRoutesAndConfig()//REGISTER ROUTES
            await this.CreateUserDefaultOperatorBD() //Create default user operator in BD if nos exists.
            await this.StartHTTP()//START HTTP SERVER WITH ROUTES REGISTERS
            StartDocumentationSwagger() //START DOCUMENTATION IF NOT PRODUCTION (SWAGGER) ON PORT 3030
            this.ShutdownNegociation()//If one process crashes, Node will try to start another one. Keeping the server UP as much as possible
            return this.fastifyServer //this return is for tests modules
        }
        catch (error: any) {
            Logger.error(`ERROR => ERROR WHILE ATTEMPTING TO START THE SERVER: ${error}`)
            return false
        }
    }
}
export { StartServerClass }
