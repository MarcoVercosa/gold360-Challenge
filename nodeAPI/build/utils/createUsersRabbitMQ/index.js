"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersRabbitMQ = void 0;
const child_process_1 = require("child_process");
function CreateUsersRabbitMQ() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('sh ./src/utils/createUsersRabbitMQ/scriptUserRabbitMQ.sh', (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                setTimeout(() => {
                    console.log("we try create users again in 5 secs ");
                    CreateUsersRabbitMQ();
                }, 5000);
            }
            console.log("Users created sucessufully");
            resolve(true);
        });
    });
}
exports.CreateUsersRabbitMQ = CreateUsersRabbitMQ;
//# sourceMappingURL=index.js.map