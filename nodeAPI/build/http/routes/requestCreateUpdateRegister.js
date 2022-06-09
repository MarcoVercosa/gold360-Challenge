"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCreateUpdateRegister = void 0;
const index_1 = require("../../useCases/requestCreateUpdateRegisterRoute/index");
const createLogs_1 = require("../../services/createLogs/createLogs");
async function RequestCreateUpdateRegister(fastify) {
    fastify.post('/register', async (request, response) => {
        let { result, codeResult } = await index_1.requestCreateUpdateRegisterController.Handle(request);
        createLogs_1.Logger.http(`HTTP => url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`);
        createLogs_1.Logger.verbose(`ACCESS =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestCreateUpdateRegister = RequestCreateUpdateRegister;
//# sourceMappingURL=requestCreateUpdateRegister.js.map