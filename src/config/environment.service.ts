require('dotenv').config(); // used to handle .env file that are set into 'process.env'
import {Injectable} from '@nestjs/common';
import removeHttpPrefix from '../utilities/removeHttpPrefix';
import {IEnvironment} from './environment.interface';

@Injectable()
export class EnvironmentService implements IEnvironment {

    isProduction: boolean;
    hostname: string;
    port: number;
    whitelist: Set<string>;
    logDir: string;

    constructor() {

        this.isProduction = (process.env.NODE_ENV || 'development') === 'production';
        this.hostname = (process.env.HOSTNAME || 'localhost');
        this.port = (parseInt(process.env.PORT, 10) || 8080);
        this.whitelist = new Set(
            // comma-separated host names
            (process.env.WHITELIST || '').split(
                ','
            ).concat(
                `${this.hostname}:${this.port}` // add server host name
            ).filter((host) =>
                !!(host)
            ).map((host) =>
                removeHttpPrefix(host)
            ),
        );
        this.logDir = (process.env.LOG_DIR || 'winston.logs');
    }

}
