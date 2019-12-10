import {Body, Controller, Get, Inject, Param, Post, Put, Query} from '@nestjs/common';
import {IsIn, IsNotEmpty} from 'class-validator';
import {AppService} from './app.service';
import {Logger} from 'winston';

class PostQuery {
    @IsIn(['happy', 'sad'])
    mood: string;
}

class PostBody {
    @IsNotEmpty()
    hello: string;
}

@Controller()
export class AppController {

    constructor(private readonly appService: AppService,
                @Inject('logger') private readonly logger: Logger) {
    }

    @Get('/')
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/:name')
    getHelloName(@Param('name') name: string,
                 @Query('mood') mood?: string): string {
        return (mood)
            ? `Your name is ${name}, and you appear to be ${mood}.`
            : `Hello there, ${name}. What is your mood?`;
    }

    @Put('/:name')
    putHello(@Param('name') name: string,
             @Body() body: any) {
        return { success: true, name, body };
    }

    @Post('/:name/:id')
    postHello(@Param() params: {name: string, id: string},
              @Query() query: PostQuery,
              @Body() body: PostBody) {
        return { success: true, params, query, body };
    }

}
