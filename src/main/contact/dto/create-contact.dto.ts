import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    required: true,
    example: 'John',
    description: 'Name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    example: 'john@example.com',
    description: 'Email of the user',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'This is a message',
    description: 'Message from the user',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
