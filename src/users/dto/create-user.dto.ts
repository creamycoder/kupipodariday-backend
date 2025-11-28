import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatar?: 'https://i.pravatar.cc/150?img=3';

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about?: string;
}