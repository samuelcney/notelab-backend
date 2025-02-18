import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getAppInfoTest() {
    return {
      statusCode: 200,
      message: 'the server is operating correctly',
    };
  }
}
