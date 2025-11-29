import {
  Body,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    getUser(@Req() req: RequestWithUser) {
        return req.user;
    }

    @Get(':username')
    async getUserByName(@Param('username') username: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new NotFoundException();
        }
        delete user.password;
        delete user.email;
        return user;
    }

    @Get('me/wishes')
    @Header('Content-type', 'application/json')
    async getOwnWishes(@Req() req: RequestWithUser) {
        return this.usersService.getUserWishes(req.user.id);
    }

    @Get(':username/wishes')
    @Header('Content-Type', 'application/json')
    async getWishesByUsername(@Param('username') username: string) {
        const user = await this.getUserByName(username);
        return this.usersService.getUserWishes(user.id);
    }

    @Post('find')
    @Header('Content-Type', 'application/json')
    async findUserByEmailOrUserName(@Body() findUserDto: FindUsersDto) {
        const { query } = findUserDto;
        const user = await this.usersService.findMany(query);
        if (!user) {
            return;
        }
        delete user[0].password;
        return user;
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch('me')
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: RequestWithUser,
    ) {
        return this.usersService.updateOne(req.user.id, updateUserDto);
    }
}