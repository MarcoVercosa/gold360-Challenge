"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsumerCancelRegisterController_1 = require("./useCase/ConsumerCancelRegisterController");
const consumerCancelRegisterUseCase_1 = require("./useCase/consumerCancelRegisterUseCase");
const consumerCancelRegisterRepository_1 = require("./repository/consumerCancelRegisterRepository");
let consumerCancelActiveRegisterRepository = new consumerCancelRegisterRepository_1.ConsumerCancelRegisterRepository();
let consumerCancelActiveRegisterUseCase = new consumerCancelRegisterUseCase_1.ConsumerCancelRegisterUseCase(consumerCancelActiveRegisterRepository);
let consumerCancelActiveRegisterController = new ConsumerCancelRegisterController_1.ConsumerCancelRegisterController(consumerCancelActiveRegisterUseCase);
consumerCancelActiveRegisterController.Handle();
//# sourceMappingURL=index.js.map