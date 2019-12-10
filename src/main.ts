import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {EnvironmentService} from './config/environment.service';
import * as nocache from 'nocache';
import {corsMiddleware} from './middleware/cors.middleware';
import {morganMiddleware} from './middleware/morgan.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // resolved by DI
    const logger = app.get('logger');
    const environment = app.get(EnvironmentService);

    app.use(nocache());
    app.use(morganMiddleware(logger));
    app.use(corsMiddleware(environment.whitelist));
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(environment.port);
}

bootstrap();
