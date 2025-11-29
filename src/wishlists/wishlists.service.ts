import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishListDto } from './dto/create-wishList.dto';
import { UpdateWishListDto } from './dto/update-wishList.dto';
import { WishList } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private wishListsRepository: Repository<WishList>,
    private wishesService: WishesService,
  ) {}

  findMany(query: FindManyOptions<WishList>) {
    return this.wishListsRepository.find(query);
  }

  async findOne(query: FindOneOptions<WishList>): Promise<WishList> {
    return this.wishListsRepository.findOne(query);
  }

  async getWishlists() {
    return await this.findMany({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async getWishlistsById(id: string) {
    const wishlist = await this.wishListsRepository.findOne({
      where: [{ id: +id }],
      relations: {
        items: true,
        owner: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException();
    }
    return wishlist;
  }

  async create(owner: User, createWishListDto: CreateWishListDto) {
    delete owner.password;
    delete owner.email;

    const wishes = await this.wishesService.findMany({});

    const items = createWishListDto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });

    const newWishList = this.wishListsRepository.create({
      ...createWishListDto,
      owner: owner,
      items: items,
    });

    return this.wishListsRepository.save(newWishList);
  }

  async updateOne(updateWishListDto: UpdateWishListDto, id: string) {
    await this.wishListsRepository.update(id, updateWishListDto);
    const updatedWishList = await this.findOne({
      where: { id: +id },
      relations: {
        owner: true,
        items: true,
      },
    });
    return updatedWishList;
  }
}