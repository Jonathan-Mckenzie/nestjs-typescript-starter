import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {EnvironmentService} from '../config/environment.service';
import {loggerFactory} from '../utilities/logger-generator';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
    imports: [],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
        EnvironmentService,
        {
            provide: 'logger',
            useFactory: loggerFactory,
            inject: [EnvironmentService]
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(
            // middleware
        );
    }
}
