import { IsNotEmpty, IsString } from 'class-validator';

class Dob {
  @IsString()
  @IsNotEmpty()
  day: string;

  @IsString()
  @IsNotEmpty()
  month: string;

  @IsString()
  @IsNotEmpty()
  year: string;
}

class Individual {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  dob: Dob;
}

class Business_profile {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  product_description: string;

  @IsString()
  @IsNotEmpty()
  support_email: string;

  @IsString()
  @IsNotEmpty()
  support_phone: string;

  @IsString()
  @IsNotEmpty()
  url: string; // must include http:// or https://
}

export class CreateExpressAccountDto {
  id: string;
  email: string;
  individual: Individual;
  business_profile: Business_profile;
}
