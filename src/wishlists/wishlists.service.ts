import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishListsRepository.find({
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
        items: true,
      },
    });
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const newWishList = await this.wishListsRepository.create({
      ...rest,
      owner: {
        id: userId,
      },
      items,
    });
    const { id } = await this.wishListsRepository.save(newWishList);
    return this.wishListsRepository.findOne({
      where: {
        id: id,
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
        items: true,
      },
    });
  }

  async findOne(wishListId: number): Promise<Wishlist> {
    const wishList = await this.wishListsRepository.findOne({
      where: { id: wishListId },
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
        items: true,
        owner: true,
      },
    });
    return wishList;
  }

  async remove(userId: number, wishlistId: number) {
    if (await this.verifyUserActivity(userId, wishlistId)) {
      throw new ForbiddenException('Нельзя удалить чужую коллекцию');
    }

    return this.wishListsRepository.delete({ id: wishlistId });
  }

  async verifyUserActivity(userId: number, wishlistId: number) {
    const wishList = await this.wishListsRepository.findOne({
      where: {
        id: wishlistId,
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
      },
    });

    return wishList.owner.id !== userId ? true : false;
  }

  async update(
    userId: number,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    if (await this.verifyUserActivity(userId, wishlistId)) {
      throw new ForbiddenException('Нельзя редактировать чужую коллекцию');
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));

    await this.wishListsRepository.save({
      id: wishlistId,
      ...rest,
      items,
    });

    const updatedWish = this.wishListsRepository.findOne({
      where: { id: wishlistId },
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
        items: true,
      },
    });

    return updatedWish;
  }
}
