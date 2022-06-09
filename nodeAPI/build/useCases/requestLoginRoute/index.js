"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoginController = void 0;
const requestLoginRepository_1 = require("../../repositories/requestLoginRoute/requestLoginRepository");
const requesLoginUseCase_1 = require("./requesLoginUseCase");
const requesLoginController_1 = require("./requesLoginController");
const requestLoginRepository = new requestLoginRepository_1.RequestLoginRepository();
const requestLoginUseCase = new requesLoginUseCase_1.RequestLoginUseCase(requestLoginRepository);
const requestLoginController = new requesLoginController_1.RequestLoginController(requestLoginUseCase);
exports.requestLoginController = requestLoginController;
//# sourceMappingURL=index.js.map