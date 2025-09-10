import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  address: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  postcode: string;

  @IsString()
  @Length(10, 500)
  description: string;
}

export class ExpreeAccountDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Length(2, 50)
  email: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  createProfileDto: CreateProfileDto;
}
