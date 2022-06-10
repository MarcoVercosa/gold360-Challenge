"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartDocumentationSwagger = void 0;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const createLogs_1 = require("../services/createLogs/createLogs");
const expressServer = (0, express_1.default)();
function StartDocumentationSwagger() {
    if (process.env.NODE_ENV != "production"
        && process.env.NODE_ENV != "test") {
        try {
            expressServer.use("/documentation", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
            expressServer.listen(3030, () => {
                createLogs_1.Logger.info(`HTTP DOCUMENTATION SWAGGER => started and listening on ${3030} o process ${process.pid}`);
            });
        }
        catch (error) {
            createLogs_1.Logger.error(`HTTP DOCUMENTATION SWAGGER => ERROR: ${error}`);
        }
    }
}
exports.StartDocumentationSwagger = StartDocumentationSwagger;
//# sourceMappingURL=documentation.js.map