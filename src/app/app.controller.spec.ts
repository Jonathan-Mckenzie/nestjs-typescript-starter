import {Test, TestingModule} from '@nestjs/testing';
import {IEnvironment} from '../config/environment.interface';
import {EnvironmentService} from '../config/environment.service';
import {loggerFactory} from '../utilities/logger-generator';
import {AppController} from './app.controller';
import {AppService} from './app.service';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: EnvironmentService,
                    useValue: <IEnvironment> {
                        isProduction: false,
                        hostname: '',
                        port: 0,
                        whitelist: new Set(),
                        logDir: 'winston.logs',
                    }
                },
                {
                    provide: 'logger',
                    useFactory: loggerFactory,
                    inject: [EnvironmentService]
                }
            ],
        }).compile();
    });

    describe('getHello', () => {
        it('should return "Hello World!"', () => {
            const appController = app.get<AppController>(AppController);
            expect(appController.getHello()).toBe('Hello World!');
        });

    });

    describe('getHelloName', () => {
        it('should ask and tell me my mood', () => {
            const appController = app.get<AppController>(AppController);
            const name = 'bob';
            const mood = 'testy';
            expect(appController.getHelloName(name)).toEqual(
                `Hello there, ${name}. What is your mood?`
            );
            expect(appController.getHelloName(name, mood)).toEqual(
                `Your name is ${name}, and you appear to be ${mood}.`
            );
        });
    });

    describe('putHello', () => {
        it('should tell me my mood', () => {
            const appController = app.get<AppController>(AppController);
            const name = 'bob';
            const response = appController.putHello(name, {suh: 'dude'});
            expect(response.success).toEqual(true);
            expect(response.name).toEqual(name);
            expect(response.body.suh).toEqual('dude');
        });
    });

    describe('postHello', () => {
        it('should tell me my mood', () => {
            const appController = app.get<AppController>(AppController);
            const params = {name: 'bob', id: '123'};
            const query = { mood: 'happy' };
            const body = { hello: 'friend' };
            const response = appController.postHello(params, query, body);
            expect(response.success).toEqual(true);
            expect(response.params.name).toEqual(params.name);
            expect(response.params.id).toEqual(params.id);
            expect(response.body.hello).toEqual(body.hello);
        });
    });
});
