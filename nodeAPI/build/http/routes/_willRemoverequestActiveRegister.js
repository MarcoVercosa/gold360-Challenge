"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestActiveRegister = void 0;
const _willRemoverequestActiveRegisterRoute_1 = require("../../useCases/_willRemoverequestActiveRegisterRoute");
async function RequestActiveRegister(fastify, options) {
    fastify.post('/active', async (request, response) => {
        let { result, codeResult } = await _willRemoverequestActiveRegisterRoute_1.requestActiveRegisterController.Handle(request);
        response.code(codeResult).header('Content-Type', 'application/json; charset=utf-8').send(result);
    });
}
exports.RequestActiveRegister = RequestActiveRegister;
//# sourceMappingURL=_willRemoverequestActiveRegister.js.map