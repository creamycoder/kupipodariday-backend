import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
      relations: {
        offers: true,
        owner: true,
      },
    });

    const newOffer = this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    return this.offersRepository.save(newOffer);
  }

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    return this.offersRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offersRepository.find(query);
  }

  async getOffers() {
    const offersArr = await this.findMany({
      relations: {
        item: { offers: true, owner: true },
        user: {
          offers: { item: true },
          wishes: { offers: true, owner: true },
          wishlists: true,
        },
      },
    });

    offersArr.forEach((offer) => {
      offer.amount = Number(offer.amount);
      offer.item.price = Number(offer.item.price);
      offer.user.wishes.forEach((wish) => (wish.price = Number(wish.price)));
    });

    return offersArr;
  }

  async getOfferById(id: string) {
    const offer = await this.offersRepository.findOne({
      where: [{ id: +id }],
      relations: {
        item: { offers: true, owner: true },
        user: { offers: true, wishes: true, wishlists: true },
      },
    });
    if (!offer) {
      throw new NotFoundException();
    }

    offer.amount = Number(offer.amount);

    offer.item.price = Number(offer.item.price);

    return offer;
  }
}