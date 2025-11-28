import { Module } from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { WishesController } from "./wishes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wish } from "./wish.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Wish])],
    providers: [WishesService],
    controllers: [WishesController],
})
export class WishesModule {}