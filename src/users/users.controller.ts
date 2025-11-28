import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findMany();
    }

    @Get('me')
    getUser(@Req() req: RequestWithUser) {
        return req.user;
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

    @Delete(':id')
    async removeById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException();
        }
        await this.usersService.removeOne(id);
    }
}