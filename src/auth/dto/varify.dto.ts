import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class VarifyEmailDto {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;
}

export class CheckVarifyEmail {
  @ApiProperty({
    required: true,
    example: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
    message: 'Invalid email format',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
