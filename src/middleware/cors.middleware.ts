import * as cors from 'cors';
import removeHttpPrefix from '../utilities/removeHttpPrefix';
import {Request, Response, NextFunction} from 'express';

/*
    sets headers origin if not defined
    check for cross origin valid hosts
 */
export const corsMiddleware = (whitelist: Set<string>) => (req: Request, res: Response, next: NextFunction) => {

    const whitelistStr: string = Array.from(whitelist).toString();

    const generateCorsError = (origin: string): Error => {
        return new Error(`${origin} not allowed by CORS, allowed hosts: ${whitelistStr}`);
    };

    const corsOptions: cors.CorsOptions = {
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        origin: (origin, callback) => {
            const originProcessed = removeHttpPrefix(origin);
            whitelist.has(originProcessed)
                ? callback(null, true)
                : callback(generateCorsError(originProcessed));
        },
    };

    req.headers.origin = req.headers.origin || req.headers.host;

    cors(corsOptions)(req, res, next);
};
