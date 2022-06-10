"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const connections_1 = require("../../services/connections");
const { combine, timestamp, json, printf } = winston_1.default.format;
// levelFilter
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
// }
// const level = (): string => {
//     const env = process.env.NODE_ENV || 'development'
//     const isDevelopment = env === 'development'
//     return isDevelopment ? 'debug' : 'warn'
// }
// const colors = {
//     error: 'red',
//     warn: 'yellow',
//     info: 'green',
//     http: 'magenta',
//     debug: 'white',
// }
// winston.addColors(colors)
// const format = winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     //winston.format.colorize({ all: true }),
//     winston.format.json(),
//     winston.format.printf(
//         (info) => `{"level":"${info.level}","message": ${JSON.stringify(info.message)},"Date":"${info.timestamp}","originServer":"${OS.hostname()}"}`
//     ),
// )
// const transports = [
//     new winston.transports.File({ filename: `${__dirname}/../../../../logs/error.log`, level: 'error', }),
//     new winston.transports.File({ filename: `${__dirname}/../../../../logs/warn.log`, level: 'warn', }),
//     new winston.transports.File({ filename: `${__dirname}/../../../../logs/info.log`, level: 'info', }),
//     new winston.transports.File({ filename: `${__dirname}/../../../../logs/http.log`, level: 'http', }),
//     new winston.transports.File({ filename: `${__dirname}/../../../../logs/debug.log`, level: 'debug', }),
// ]
// const Logger = winston.createLogger({
//     level: level(),
//     levels,
//     format,
//     transports,
// })
// if (process.env.NODE_ENV !== 'production') {
//     Logger.add(new winston.transports.Console({
//         //format: winston.format.simple()
//     }));
// }
// export { Logger }
let connection = (0, connections_1.ConnectionsName)();
const errorFilter = winston_1.default.format((info, opts) => {
    return info.level === 'error' ? info : false;
});
const warnFilter = winston_1.default.format((info, opts) => {
    return info.level === 'warn' ? info : false;
});
const infoFilter = winston_1.default.format((info, opts) => {
    return info.level === 'info' ? info : false;
});
const httpFilter = winston_1.default.format((info, opts) => {
    return info.level === 'http' ? info : false;
});
const alertFilter = winston_1.default.format((info, opts) => {
    return info.level === 'alert' ? info : false;
});
const verboseFilter = winston_1.default.format((info, opts) => {
    return info.level === 'verbose' ? info : false;
});
let transports;
let Printf = printf((info) => `{"level":"${info.level}","message": ${JSON.stringify(info.message)},"Date":"${info.timestamp}","originServer":"${connection.serverNodeConsumerCancelRegister}"}`);
process.env.NODE_ENV == 'production' ?
    transports = [
        new winston_1.default.transports.File({
            filename: `${__dirname}/../../../logs/error.log`, level: 'error',
            format: combine(errorFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Printf),
        }),
        new winston_1.default.transports.File({
            filename: `${__dirname}/../../../logs/warn.log`, level: 'warn',
            format: combine(warnFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Printf),
        }),
        new winston_1.default.transports.File({
            filename: `${__dirname}/../../../logs/info.log`, level: 'info',
            format: combine(infoFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Printf),
        }),
        new winston_1.default.transports.File({
            filename: `${__dirname}/../../../logs/http.log`, level: 'http',
            format: combine(httpFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Printf),
        }),
        new winston_1.default.transports.File({
            filename: `${__dirname}/../../../logs/alert.log`, level: 'alert',
            format: combine(alertFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Printf),
        }),
        new winston_1.default.transports.File({
            filename: `${__dirname}/../../../logs/verbose.log`, level: 'verbose',
            format: combine(verboseFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Printf),
        }),
    ] : transports = [new winston_1.default.transports.Console({ format: winston_1.default.format.simple() })];
const Logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json(), Printf),
    transports //the path logs are configure to running in docker
});
exports.Logger = Logger;
//# sourceMappingURL=createLogs.js.map