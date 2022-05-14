import winston from 'winston'
import OS from "os"

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,

}
const level = (): string => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}
winston.addColors(colors)
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    //winston.format.colorize({ all: true }),
    winston.format.json(),
    winston.format.printf(
        (info) => `{"level":"${info.level}","message": ${JSON.stringify(info.message)},"Date":"${info.timestamp}","originServer":"${OS.hostname()}"}`,
    ),
)
const transports = [
    new winston.transports.File({ filename: `${__dirname}/../../../../logs/error.log`, level: 'error', }),
    new winston.transports.File({ filename: `${__dirname}/../../../../logs/warn.log`, level: 'warn', }),
    new winston.transports.File({ filename: `${__dirname}/../../../../logs/info.log`, level: 'info', }),
    new winston.transports.File({ filename: `${__dirname}/../../../../logs/http.log`, level: 'http', }),
    new winston.transports.File({ filename: `${__dirname}/../../../../logs/debug.log`, level: 'debug', }),
]

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

if (process.env.NODE_ENV !== 'production') {
    Logger.add(new winston.transports.Console({
        //format: winston.format.simple()
    }));
}

export { Logger }