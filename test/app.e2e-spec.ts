import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/app/app.module';
import {INestApplication, ValidationPipe} from '@nestjs/common';

describe('App e2e', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('GET /', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });

    it('GET /:name', () => {
        const name = 'Elliot Alderson';
        return request(app.getHttpServer())
            .get(`/${name}`)
            .expect(200)
            .expect(`Hello there, ${name}. What is your mood?`);
    });

    it('GET /:name?mood=happy', () => {
        const name = 'bob';
        const mood = 'happy';
        return request(app.getHttpServer())
            .get(`/${name}?mood=${mood}`)
            .expect(200)
            .expect(`Your name is ${name}, and you appear to be ${mood}.`);
    });

    it('PUT /:name', () => {
        const name = 'bob';
        const body = {suh: 'dude'};
        return request(app.getHttpServer())
            .put(`/${name}`)
            .send(body)
            .expect(200, {
                success: true,
                name,
                body
            });
    });

    it('POST /:name/:id', () => {
        const name = 'bob';
        const id = '123';
        const mood = 'happy';
        const body = { hello: 'friend'};
        return request(app.getHttpServer())
            .post(`/${name}/${id}?mood=${mood}`)
            .send(body)
            .expect(201, {
                success: true,
                params: {
                    name,
                    id
                },
                query: {
                    mood
                },
                body
            });
    });

    it('POST /:name/:id (Fail on mood)', () => {
        const name = 'bob';
        const id = '123';
        const mood = 'testy';
        const body = { hello: 'friend'};
        return request(app.getHttpServer())
            .post(`/${name}/${id}?mood=${mood}`)
            .send(body)
            .expect(400);
    });

    it('POST /:name/:id (Fail on body)', () => {
        const name = 'bob';
        const id = '123';
        const mood = 'happy';
        const body = { unknown: 'friend'};
        return request(app.getHttpServer())
            .post(`/${name}/${id}?mood=${mood}`)
            .send(body)
            .expect(400);
    });
});
