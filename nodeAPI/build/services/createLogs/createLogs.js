"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), 
//winston.format.colorize({ all: true }),
winston_1.default.format.json());
const transports = [
    new winston_1.default.transports.File({ filename: `${__dirname}/../../../../logs/error.log`, level: 'error', }),
    new winston_1.default.transports.File({ filename: `${__dirname}/../../../../logs/warn.log`, level: 'warn', }),
    new winston_1.default.transports.File({ filename: `${__dirname}/../../../../logs/info.log`, level: 'info', }),
    new winston_1.default.transports.File({ filename: `${__dirname}/../../../../logs/http.log`, level: 'http', }),
    new winston_1.default.transports.File({ filename: `${__dirname}/../../../../logs/debug.log`, level: 'debug', }),
];
const Logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
exports.Logger = Logger;
if (process.env.NODE_ENV !== 'production') {
    Logger.add(new winston_1.default.transports.Console({
    //format: winston.format.simple()
    }));
}
//# sourceMappingURL=createLogs.js.map