import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      ok: true,
      service: 'finance-api',
      timestamp: new Date().toISOString(),
    };
  }
}
