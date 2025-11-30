import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      'Пользователь с таким именем или почтой уже существует',
      HttpStatus.BAD_REQUEST,
    );
  }
}
