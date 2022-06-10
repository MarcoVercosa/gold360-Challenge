import OS from "os"
import cluster from "cluster"
import { StartConsumer } from "./index"
import { Logger } from "./services/createLogs/createLogs"


function RunPrimaryProcess() {
    let cpus: number = OS.cpus().length
    Logger.warn(`ALERT - Primary ${process.pid} is started `)

    for (let index = 0; index < 1; index++) {//execute only 1 process
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
    StartConsumer()
    // for each cluster.fork() above, a new server instance will be created calling the function StartServer()
}
cluster.isPrimary ? RunPrimaryProcess() : RunWorkerProcess()
//cluster.isPrimary: boolean -> quem gerencia/balanceia as requisições. Cria instâncias worker e gerencia para cada worker executar a aplicação


