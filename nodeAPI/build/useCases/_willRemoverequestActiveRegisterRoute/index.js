"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestActiveRegisterController = void 0;
const requestActiveRegisterRepository_1 = require("../../repositories/requestActiveRegisterRoute/requestActiveRegisterRepository");
const requestActiveRegisterUseCase_1 = require("./requestActiveRegisterUseCase");
const requestActiveRegisterController_1 = require("./requestActiveRegisterController");
const requestActiveRegisterRepository = new requestActiveRegisterRepository_1.RequestActiveRegisterRepository();
const requestLActiveRegisterUseCase = new requestActiveRegisterUseCase_1.RequestActiveRegisterUseCase(requestActiveRegisterRepository);
const requestActiveRegisterController = new requestActiveRegisterController_1.RequestActiveRegisterController(requestLActiveRegisterUseCase);
exports.requestActiveRegisterController = requestActiveRegisterController;
//# sourceMappingURL=index.js.map