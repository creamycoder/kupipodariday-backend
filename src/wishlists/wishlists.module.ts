import { Module } from "@nestjs/common";
import { WishlistsController } from "./wishlists.controller";
import { WishlistsService } from "./wishlists.service";

@Module({
    providers: [WishlistsService],
    controllers: [WishlistsController],
})
export class WishlistsModule {}