import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'Username of the person who submitted the report',
    example: 'mdsharif',
  })
  @IsString()
  report_username: string;

  @ApiProperty({
    description: 'Type of the report (e.g. bug, feedback, abuse)',
    example: 'bug',
  })
  @IsString()
  report_type: string;

  @ApiProperty({
    description: 'Detailed description of the report',
    example: 'The website crashes when uploading a file larger than 10MB.',
  })
  @IsString()
  report_description: string;

  @ApiPropertyOptional({
    description: 'First relevant link (optional)',
    example: 'https://example.com/screenshot1',
  })
  @IsOptional()
  @IsString()
  report_relevant_link?: string;

  @ApiPropertyOptional({
    description: 'Second relevant link (optional)',
    example: 'https://example.com/screenshot2',
  })
  @IsOptional()
  @IsString()
  report_relevant_link2?: string;

  @ApiPropertyOptional({
    description: 'Uploaded file related to the report (optional)',
    type: 'string',
    format: 'binary',
  })
  report_relevant_file?: Express.Multer.File;

  @ApiProperty({
    description: 'Email of the user who created the report',
    example: 'sharif@example.com',
  })
  @IsEmail()
  report_created_email: string;
}
