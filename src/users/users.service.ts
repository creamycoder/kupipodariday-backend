import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FindOneOptions, Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-user.dto';
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
        const { email, username } = createUserDto;

        const existUser = await this.usersRepository.find({
            where: [{ email: email }, { username: username }],
        });

        if (existUser.length !== 0) {
            throw new ConflictException(
                'Пользователь с таким email или username уже зарегистрирован',
            );
        }

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

    findMany(query: string) {
        return this.usersRepository.find({
            where: [{ email: query }, { username: query }],
        });
    }

    async findByUsername(username: string) {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user;
    }

    async updateOne(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await this.hashServise.hash(
                updateUserDto.password,
            );
        }
        await this.usersRepository.update({ id }, updateUserDto);

        const updatedUser = await this.findOne({
            where: { id: +id },
        });

        delete updatedUser.password;

        return updatedUser;
    }

    async getUserWishes(id: number) {
        const user = await this.findOne({
            where: { id: id },
            relations: {
                wishes: {
                    owner: true,
                    offers: {
                        item: { owner: true, offers: true },
                        user: { wishes: true, offers: true, wishlists: true },
                    },
                },
            },
        });

        const userWishes = user.wishes.filter((wish) => {
            delete wish.owner.password;
            delete wish.owner.email;
            wish.price = Number(wish.price);
            return wish;
        });

        return userWishes;
    }

    async findUserByEmailOrUserName(findUserDto: FindUsersDto) {
        const { query } = findUserDto;
        const user = await this.findMany(query);
        if (!user) {
            return;
        }
        delete user[0].password;
        return user;
    }
}