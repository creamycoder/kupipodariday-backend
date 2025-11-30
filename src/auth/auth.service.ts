import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    return {
      access_token: this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: '1d',
        },
      ),
    };
  }

  async validatePassword(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isMatched = await this.hashService.verify(pass, user.password);
      const { password, ...result } = user;

      return isMatched ? result : null;
    }

    return null;
  }
}
