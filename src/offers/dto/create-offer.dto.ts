import { IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';
export class CreateOfferDto {
  @Min(1)
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
