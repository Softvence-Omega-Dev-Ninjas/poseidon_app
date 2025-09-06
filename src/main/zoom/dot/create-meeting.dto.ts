import { IsEmail, IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoomUserDto {
  @ApiProperty({ example: 'provider@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class CreateMeetingDto {
  @ApiProperty({ example: 'Consultation Call' })
  @IsString()
  topic: string;

  @ApiProperty({example:'hasanmahadiius22@gmail.com'})
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2025-09-05T10:00:00Z', description: 'ISO 8601 date-time' })
  @IsDateString()
  start_time: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  duration: number;

  @ApiProperty({ example: 'Initial client consultation', required: false })
  @IsOptional()
  @IsString()
  agenda?: string;
}
