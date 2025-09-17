import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export function createLogger(serviceName: string): winston.Logger {
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}] ${serviceName}: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
      }`;
    })
  );

  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
      // Console transport
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),
      // File transport with rotation
      new DailyRotateFile({
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