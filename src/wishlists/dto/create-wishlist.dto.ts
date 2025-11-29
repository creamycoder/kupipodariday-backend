import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWishListDto {
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  description: string;

  @IsArray()
  itemsId: number[];
}