"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogin = void 0;
const index_1 = require("../../useCases/requestLoginRoute/index");
const createLogs_1 = require("../../services/createLogs/createLogs");
async function RequestLogin(fastify) {
    fastify.post('/login', async (request, response) => {
        let { result, codeResult } = await index_1.requestLoginController.Handle(request);
        createLogs_1.Logger.warn(`HTTP =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`);
        createLogs_1.Logger.verbose(`ACCESS =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestLogin = RequestLogin;
//# sourceMappingURL=requestLogin.js.map