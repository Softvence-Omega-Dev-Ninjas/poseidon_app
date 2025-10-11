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

export class CheckVarifyEmailAfterLogin {
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
    example: 'kalachan',
  })
  @IsNumber()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    required: true,
    example: '346346',
  })
  @IsNumber()
  @IsNotEmpty()
  code: number;
}

// passsword chanage dto

export class ForgetPasswordToken {
  @ApiProperty({
    required: true,
    example: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    example: 'Password1!',
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]).{6,15}$/,
    {
      message:
        'Password must be 6-15 characters long, include at least 1 uppercase letter, 1 number, and 1 special character',
    },
  )
  newPassword: string;
}

export class ForgetPasswordCodeCheck {
  @ApiProperty({
    required: true,
    example: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    example: 'code',
  })
  @IsString()
  @IsNotEmpty()
  code: number;
}

export class ForgetPasswordSendEmail {
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
}
