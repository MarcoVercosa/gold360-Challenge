"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelRegister = void 0;
const requestCancelRegisterRoute_1 = require("../../useCases/requestCancelRegisterRoute");
async function RequestCancelRegister(fastify, options) {
    fastify.post('/cancel', async (request, response) => {
        let { result, codeResult } = await requestCancelRegisterRoute_1.requestCancelRegisterController.Handle(request);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestCancelRegister = RequestCancelRegister;
//# sourceMappingURL=requestCancelRegister.js.map