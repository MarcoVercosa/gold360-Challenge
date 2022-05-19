"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckIfAllQueuesIsCreated = void 0;
const createQueuesChannels_1 = require("../createQueuesChannels");
const dotenv_1 = require("dotenv");
const createLogs_1 = require("../../createLogs/createLogs");
async function CheckIfAllQueuesIsCreated() {
    (0, dotenv_1.config)();
    createLogs_1.Logger.info("Checking if all queue are created. Case not, will be created. This action is showing when the server is started");
    try {
        await (0, createQueuesChannels_1.CreateQueue)(process.env.CREDENTIALS_REGISTER_USER, process.env.CREDENTIALS_REGISTER_PASS, process.env.QUEUE_NAME_CREATE_UPDATE_REGISTER_BD);
        await (0, createQueuesChannels_1.CreateQueue)(process.env.CREDENTIALS_CANCEL_USER, process.env.CREDENTIALS_CANCEL_PASS, process.env.QUEUE_NAME_CANCEL_REGISTER);
        await (0, createQueuesChannels_1.CreateQueue)(process.env.CREDENTIALS_DEAD_QUEUE_USER, process.env.CREDENTIALS_DEAD_QUEUE_PASS, process.env.QUEUE_NAME_DEAD_CANCEL);
    }
    catch (err) {
        setTimeout(() => {
            createLogs_1.Logger.error(`Server not started. Because there was a failure in some queue. New Try in 5 secs`);
            CheckIfAllQueuesIsCreated();
        }, 5000);
    }
}
exports.CheckIfAllQueuesIsCreated = CheckIfAllQueuesIsCreated;
//# sourceMappingURL=checkIfAllQueuesIsCreated.js.map