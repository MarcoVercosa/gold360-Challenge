import OS from "os"
import cluster from "cluster"
import { StartServerClass } from "./http/index"
import { Logger } from "./services/createLogs/createLogs"
import { ConnectionsName } from "./services/connections"


function RunPrimaryProcess() {
    let connections = ConnectionsName()
    let cpus: number = connections.environment == "production" ? OS.cpus().length : 1
    //if environment is a not production, use only 1 core of CPU

    Logger.warn(`ALERT - Primary ${process.pid} is started `)

    for (let index = 0; index < cpus; index++) {
        cluster.fork()
    }
    cluster.on("exit", (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            //se o processo finalizou com err e não foi o S.O que o desconectou, gere uma nova copia
            Logger.error(`ERROR => Worker ${worker.process.pid} - code ${code} Signal ${signal} died. Scheduling another process`)
            cluster.fork()
        }
    })
}
async function RunWorkerProcess() {
    const startServer = new StartServerClass()
    startServer.Execute()
    // for each cluster.fork() above, a new server instance will be created calling the function StartServer()
}
cluster.isPrimary ? RunPrimaryProcess() : RunWorkerProcess()
//cluster.isPrimary: boolean -> quem gerencia/balanceia as requisições. Cria instâncias worker e gerencia para cada worker executar a aplicação


