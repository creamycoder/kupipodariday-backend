import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.userRepository.save(createUserDto);
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async findMany(): Promise<User[]> {
        return this.userRepository.find();
    }

    async updateOne(id: number, updateUserDto: UpdateUserDto) {
        return this.userRepository.update({ id }, updateUserDto);
    }

    async removeOne(id: number) {
        return this.userRepository.delete({ id });
    }
}