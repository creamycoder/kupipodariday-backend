import { Module } from "@nestjs/common";
import { WishlistsController } from "./wishlists.controller";
import { WishlistsService } from "./wishlists.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishList } from "./entities/wishlist.entity";
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
    imports: [TypeOrmModule.forFeature([WishList]), WishesModule],
    providers: [WishlistsService],
    controllers: [WishlistsController],
})
export class WishlistsModule {}