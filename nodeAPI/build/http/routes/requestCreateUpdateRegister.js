"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCreateUpdateRegister = void 0;
const index_1 = require("../../useCases/requestCreateUpdateRegisterRoute/index");
async function RequestCreateUpdateRegister(fastify, options) {
    fastify.post('/register', async (request, response) => {
        let { result, codeResult } = await index_1.requestCreateUpdateRegisterController.Handle(request, response);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestCreateUpdateRegister = RequestCreateUpdateRegister;
//# sourceMappingURL=requestCreateUpdateRegister.js.map