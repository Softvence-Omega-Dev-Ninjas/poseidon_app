import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminMailDto {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    example: 'subject',
  })
  @IsNotEmpty({ message: 'Subject should not be empty' })
  @IsString()
  subject: string;

  @ApiProperty({
    required: true,
    example: 'message',
  })
  @IsNotEmpty({ message: 'Message should not be empty' })
  @IsString()
  message: string;
}

export class AdminMailUseMultiUserDto {
  @ApiProperty({
    required: true,
    example: [
      'user1@gmail.com',
      'user2@gmail.com',
      'user3@gmail.com',
      'user4@gmail.com',
    ],
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString()
  emails: string[];

  @ApiProperty({
    required: true,
    example: 'subject',
  })
  @IsNotEmpty({ message: 'Subject should not be empty' })
  @IsString()
  subject: string;

  @ApiProperty({
    required: true,
    example: 'message',
  })
  @IsNotEmpty({ message: 'Message should not be empty' })
  @IsString()
  message: string;
}
