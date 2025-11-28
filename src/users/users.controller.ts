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
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
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

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @Patch(':id')
    async updateById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const user = await this.usersService.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException();
        }
        return this.usersService.updateOne(id, updateUserDto);
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