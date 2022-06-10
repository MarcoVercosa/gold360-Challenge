"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckIfAllQueuesIsCreated = void 0;
const createQueuesChannels_1 = require("../createQueuesChannels");
const createLogs_1 = require("../../createLogs/createLogs");
const index_1 = require("../../connections/index");
async function CheckIfAllQueuesIsCreated() {
    let connections = (0, index_1.ConnectionsName)();
    createLogs_1.Logger.info("Checking if all queue are created. Case not, will be created. This action is showing when the server is started");
    try {
        const createUpdateRegisterBD = await (0, createQueuesChannels_1.CreateQueue)(connections.credentialsRegisterUser, connections.credentialsRegisterPass, connections.queueNameCreateUpdateRegisterBD);
        const cancelRegister = await (0, createQueuesChannels_1.CreateQueue)(connections.credentialsCancelUser, connections.credentialsCancelPass, connections.queueNameCancelRegister);
        const deadCancel = await await (0, createQueuesChannels_1.CreateQueue)(connections.credentialsDeadQueueUser, connections.credentialsDeadQueuePass, connections.queueNameDeadCancel);
        if (createUpdateRegisterBD && cancelRegister && deadCancel) {
            return true;
        }
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