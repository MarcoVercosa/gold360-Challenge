"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelRegister = void 0;
const createLogs_1 = require("../../services/createLogs/createLogs");
const requestCancelRegisterRoute_1 = require("../../useCases/requestCancelRegisterRoute");
async function RequestCancelRegister(fastify, options) {
    fastify.post('/cancel', async (request, response) => {
        let { result, codeResult } = await requestCancelRegisterRoute_1.requestCancelRegisterController.Handle(request);
        createLogs_1.Logger.http(`HTTP =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`);
        createLogs_1.Logger.verbose(`ACCESS =>  url request: ${request.url} - ip: ${request.ip} - hostname: ${request.hostname} - result: ${JSON.stringify(result)}, ${codeResult}`);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestCancelRegister = RequestCancelRegister;
//# sourceMappingURL=requestCancelRegister.js.map