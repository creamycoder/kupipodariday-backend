import { Injectable, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAlreadyExistsException } from 'src/errors/user-exists.exception';
import { HashService } from 'src/hash/hash.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...rest } = createUserDto;
      const hash = await this.hashService.hash(password);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hash,
      });
      await this.usersRepository.insert(user);
      return user;
    } catch (err) {
      throw new UserAlreadyExistsException();
    }
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    if (
      updateUserDto.hasOwnProperty('email') ||
      (updateUserDto.hasOwnProperty('username') &&
        user.email === updateUserDto.email) ||
      user.username === updateUserDto.username
    ) {
      return user;
    }

    try {
      if (updateUserDto.hasOwnProperty('password')) {
        updateUserDto.password = await this.hashService.hash(
          updateUserDto.password,
        );
      }

      await this.usersRepository.update(user.id, {
        ...updateUserDto,
      });

      return this.usersRepository.findOne({ where: { id: user.id } });
    } catch (err) {
      throw new UserAlreadyExistsException();
    }
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        wishes: {
          owner: {
            username: username,
          },
        },
      },
      select: {
        wishes: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          link: true,
          image: true,
          price: true,
          raised: true,
          copied: true,
          description: true,
          owner: {
            id: true,
            username: true,
            about: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
    });
    if (!user) {
      return [];
    }

    return user.wishes;
  }

  async findMany(query: string): Promise<User[] | undefined> {
    const user = await this.usersRepository.find({
      where: [
        {
          username: ILike(`%${query}`),
        },
        { email: ILike(`%${query}`) },
      ],
    });

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    return user;
  }
}
