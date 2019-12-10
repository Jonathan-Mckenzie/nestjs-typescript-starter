import * as winston from 'winston';
import * as fs from 'fs';
import {EnvironmentService} from '../config/environment.service';

const util = require('util');

const myFormat = winston.format.printf(({level, message, label, timestamp, ...rest}) => {
    // @ts-ignore - Type 'symbol' cannot be used as an index type
    const splat = rest[Symbol.for('splat')];
    const strArgs = splat ? splat.map((s) => util.formatWithOptions({colors: true, depth: 10}, s)).join(' ') : '';
    return `${timestamp}  ${level}  ${util.formatWithOptions({colors: true, depth: 10}, message)} ${strArgs}`;
});

const loggerFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'YYYY-M-DD HH:mm:ss',
    }),
    myFormat
);

export const loggerOptions = (isProduction: boolean, logDir?: string) => {
    return (isProduction && !!logDir)
        ? {
            transports: [
                new winston.transports.File({
                    level: 'info',
                    dirname: logDir,
                    filename: 'info.log',

                }),
                new winston.transports.File({
                    level: 'error',
                    dirname: logDir,
                    filename: 'error.log',
                })
            ],
            format: loggerFormat,
        }
        : {
            level: 'silly',
            transports: [
                new winston.transports.Console(),
            ],
            format: loggerFormat,
        };
};

export const loggerFactory = (env: EnvironmentService) => {
    if (env.isProduction && !fs.existsSync(env.logDir)) {
        fs.mkdirSync(env.logDir);
    }
    return winston.createLogger(loggerOptions(env.isProduction, env.logDir));
};


