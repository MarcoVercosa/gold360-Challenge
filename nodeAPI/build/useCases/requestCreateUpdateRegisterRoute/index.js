"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCreateUpdateRegisterController = void 0;
const requestCreateUpdateRegisterUseCase_1 = require("./requestCreateUpdateRegisterUseCase");
const requestCreateUpdateRegisterController_1 = require("./requestCreateUpdateRegisterController");
const requestLCreateUpdateRegisterUseCase = new requestCreateUpdateRegisterUseCase_1.RequestCreateUpdateRegisterUseCase();
const requestCreateUpdateRegisterController = new requestCreateUpdateRegisterController_1.RequestCreateUpdateRegisterController(requestLCreateUpdateRegisterUseCase);
exports.requestCreateUpdateRegisterController = requestCreateUpdateRegisterController;
//# sourceMappingURL=index.js.map