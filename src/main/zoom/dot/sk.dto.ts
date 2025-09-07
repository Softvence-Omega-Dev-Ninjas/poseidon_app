import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty({
    example: 'Therapy Session',
    description: 'Meeting topic or title',
  })
  @IsString()
  topic: string;

  @ApiProperty({
    example: '2025-09-04T10:30:00Z',
    description: 'Start time in ISO 8601 format',
  })
  @IsDateString()
  start_time: string; // ISO 8601 date-time string

  @ApiProperty({
    example: 60,
    description: 'Duration of meeting in minutes',
  })
  @IsInt()
  duration: number; // minutes

  @ApiPropertyOptional({
    example: 'Initial consultation session with client',
    description: 'Optional agenda or description for the meeting',
  })
  @IsOptional()
  @IsString()
  agenda?: string;
}
