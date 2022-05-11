"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogin = void 0;
const index_1 = require("../../useCases/requestLoginRoute/index");
async function RequestLogin(fastify) {
    fastify.post('/login', async (request, response) => {
        let { result, codeResult } = await index_1.requestLoginController.Handle(request, response);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestLogin = RequestLogin;
//# sourceMappingURL=requestLogin.js.map