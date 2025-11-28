import { Module } from "@nestjs/common";
import { WishlistsController } from "./wishlists.controller";
import { WishlistsService } from "./wishlists.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishList } from "./wishlist.entity";

@Module({
    imports: [TypeOrmModule.forFeature([WishList])],
    providers: [WishlistsService],
    controllers: [WishlistsController],
})
export class WishlistsModule {}