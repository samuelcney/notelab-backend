import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health-check')
  healthCheck() {
    return {
      statusCode: 200,
      message: 'the server is operating correctly',
    };
  }
}
