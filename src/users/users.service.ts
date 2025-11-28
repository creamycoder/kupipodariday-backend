import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private hashServise: HashService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hash = await this.hashServise.hash(createUserDto.password);
        const newUser = this.usersRepository.create({
            ...createUserDto,
            password: hash,
        });
        return this.usersRepository.save(newUser);
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
        if (updateUserDto.password) {
            updateUserDto.password = await this.hashServise.hash(
                updateUserDto.password,
            );
        }
        return this.usersRepository.update({ id }, updateUserDto);
    }

    async removeOne(id: number) {
        return this.usersRepository.delete({ id });
    }
}