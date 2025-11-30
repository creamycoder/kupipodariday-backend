import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async hash(password: string) {
    return await bcrypt.hash(password, this.configService.get('saltRound'));
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
