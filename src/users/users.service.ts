import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.usersRepository.save(createUserDto);
    }

    async findOne(query: FindOneOptions<User>): Promise<User> {
        return this.usersRepository.findOne(query);
    }

    async findMany(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findByUsername(username: string) {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }
    
    async updateOne(id: number, updateUserDto: UpdateUserDto) {
        return this.usersRepository.update({ id }, updateUserDto);
    }

    async removeOne(id: number) {
        return this.usersRepository.delete({ id });
    }
}