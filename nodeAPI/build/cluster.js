"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const index_1 = require("./http/index");
const createLogs_1 = require("./services/createLogs/createLogs");
function RunPrimaryProcess() {
    let cpus = os_1.default.cpus().length;
    createLogs_1.Logger.warn(`ALERT - Primary ${process.pid} is started `);
    for (let index = 0; index < cpus; index++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            //se o processo finalizou com err e não foi o S.O que o desconectou, gere uma nova copia
            createLogs_1.Logger.error(`ERROR => Worker ${worker.process.pid} - code ${code} Signal ${signal} died. Scheduling another one`);
            cluster_1.default.fork();
        }
    });
}
async function RunWorkerProcess() {
    (0, index_1.StartServer)();
    // for each cluster.fork() above, a new server instance will be created calling the function StartServer()
}
cluster_1.default.isPrimary ? RunPrimaryProcess() : RunWorkerProcess();
//cluster.isPrimary: boolean -> quem gerencia/balanceia as requisições. Cria instâncias worker e gerencia para cada worker executar a aplicação
//# sourceMappingURL=cluster.js.map