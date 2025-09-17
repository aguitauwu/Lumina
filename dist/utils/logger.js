"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
function createLogger(serviceName) {
    const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}] ${serviceName}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    }));
    const logger = winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: logFormat,
        transports: [
            // Console transport
            new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
            }),
            // File transport with rotation
            new winston_daily_rotate_file_1.default({
                filename: 'logs/bot-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d',
                createSymlink: true,
                symlinkName: 'bot-current.log'
            })
        ]
    });
    return logger;
}
//# sourceMappingURL=logger.js.map