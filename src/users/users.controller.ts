import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/types';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  findUser(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Patch('me')
  update(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @Get('me/wishes')
  findMyWishes(@Req() req: RequestWithUser) {
    return this.usersService.findUserWishes(req.user.username);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @Post('find')
  findMany(@Body() dto: FindUserDto): Promise<User[]> {
    return this.usersService.findMany(dto.query);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
