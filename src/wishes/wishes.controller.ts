import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestWithUser) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlistlists(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') id: string,
  ) {
    return this.wishesService.updateOne(updateWishDto, id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.getWishById(id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.delete(id);
  }
}