import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import * as morgan from 'morgan';
import {Logger} from 'winston';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
    constructor(@Inject('logger') private readonly logger: Logger) {
    }

    use(req: Request, res: Response, next: any) {
        morgan(
            ':method ":url" :status (:res[content-length] length) (:response-time ms)',
            {stream: {write: (text: string) => this.logger.info(text)}}
        )(req, res, next);
    }
}

export const morganMiddleware = (logger: Logger) => (req: Request, res: Response, next: any) => {
    morgan(
        ':method ":url" :status (:res[content-length] length) (:response-time ms)',
        {stream: {write: (text: string) => logger.info(text)}}
    )(req, res, next);
};

