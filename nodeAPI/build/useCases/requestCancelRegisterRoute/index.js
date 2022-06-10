"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCancelRegisterController = void 0;
//import { RequestCancelActiveRegisterRepository } from "../../repositories/requestCancelActiveRegisterRoute/requestCancelActiveRegisterRepository";
const requestCancelRegisterUseCase_1 = require("./requestCancelRegisterUseCase");
const requestCancelRegisterController_1 = require("./requestCancelRegisterController");
//const requestCancelActiveRegisterRepository = new RequestCancelActiveRegisterRepository()
const requestLCancelRegisterUseCase = new requestCancelRegisterUseCase_1.RequestCancelRegisterUseCase();
const requestCancelRegisterController = new requestCancelRegisterController_1.RequestCancelRegisterController(requestLCancelRegisterUseCase);
exports.requestCancelRegisterController = requestCancelRegisterController;
//# sourceMappingURL=index.js.map