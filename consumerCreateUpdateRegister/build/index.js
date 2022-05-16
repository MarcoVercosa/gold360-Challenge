"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consumeQueueCreatRegisterUpdateRequestController_1 = require("./useCase/consumeQueueCreatRegisterUpdateRequest/consumeQueueCreatRegisterUpdateRequestController");
const consumerCreateUpdateRegisterUseCase_1 = require("./useCase/consumeQueueCreatRegisterUpdateRequest/consumerCreateUpdateRegisterUseCase");
const CreatRegisterUpdateRequestRepository_1 = require("./repository/CreatRegisterUpdateRequestRepository");
const createLogs_1 = require("./services/createLogs/createLogs");
createLogs_1.Logger.warn(`Server consumerCreateUpdateRegister is starting on mode ${process.env.NODE_ENV}`);
let createRegisterUpdateRequestRepository = new CreatRegisterUpdateRequestRepository_1.ConsumerCreateUpdateRegisterRepository();
let consumeQueueCreatRegisterUpdateRequestUseCase = new consumerCreateUpdateRegisterUseCase_1.ConsumerCreateUpdateRegisterUseCase(createRegisterUpdateRequestRepository);
let consumeQueueCreatRegisterUpdateController = new consumeQueueCreatRegisterUpdateRequestController_1.ConsumerCreateUpdateRegisterController(consumeQueueCreatRegisterUpdateRequestUseCase);
consumeQueueCreatRegisterUpdateController.Handle();
//# sourceMappingURL=index.js.map