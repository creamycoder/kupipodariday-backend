import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find({
      relations: {
        owner: true,
      },
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }

  getLastWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  getTopWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  async findOne(wishId: number): Promise<Wish> {
    return this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      select: {
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
        offers: {
          id: true,
          createdAt: true,
          updatedAt: true,
          amount: true,
          hidden: true,
        },
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  async remove(userId: number, wishId: number) {
    if (await this.verifyUserActivity(userId, wishId)) {
      throw new ForbiddenException('Невозможно удалить чужой подарок');
    }

    return await this.wishesRepository.delete({ id: wishId });
  }

  async verifyUserActivity(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    return wish.owner.id !== userId ? true : false;
  }

  async update(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    if (await this.verifyUserActivity(userId, wishId)) {
      throw new ForbiddenException('Нельзя редактировать чужие подарки');
    }
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    await this.wishesRepository.update(
      { id: wishId },
      {
        ...updateWishDto,
        price: wish.offers.length === 0 ? updateWishDto.price : wish.price,
      },
    );
    return this.wishesRepository.findOneBy({ id: wishId });
  }

  async copy(userId: any, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: {
        owner: {
          wishes: true,
        },
      },
    });

    const isWishExists = await this.wishesRepository.findOne({
      where: {
        owner: {
          id: userId,
          wishes: {
            name: wish.name,
          },
        },
      },
    });

    if (isWishExists) {
      throw new ForbiddenException('Данное желание у вас уже имеется');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.copied++;

    const { name, link, image, price, description } = wish;

    const myNewWish = {
      name,
      link,
      image,
      price,
      description,
      owner: { id: userId },
    };

    try {
      await this.wishesRepository.save(wish);
      await this.wishesRepository.create(myNewWish);
      await this.wishesRepository.save(myNewWish);

      await queryRunner.commitTransaction();
      return myNewWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err.detail;
    } finally {
      await queryRunner.release();
    }
  }
}
