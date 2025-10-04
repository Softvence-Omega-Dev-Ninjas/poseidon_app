import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CreateCalendlyEventDto {
  @ApiPropertyOptional({ example: 'CheersLIVE' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'nok' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiHideProperty()
  // @ApiPropertyOptional({ example: 'cheerslive-nok-15-minutes' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiHideProperty()
  // @ApiProperty({
  //   example: 'solo',
  //   enum: ['solo'],
  //   description: 'Event kind (currently only solo supported)',
  // })
  @IsEnum(['solo'])
  @IsOptional()
  kind: 'solo';

  @ApiProperty({ example: 15, description: 'Duration in minutes' })
  @IsNumber()
  duration: number;

  @ApiHideProperty()
  // @ApiProperty({
  //   example: 'https://api.calendly.com/users/AAAAAAAAAAAAAA',
  //   description: 'Calendly user URI who owns the event',
  // })
  @IsString()
  @IsOptional()
  owner: string;

  @ApiHideProperty()
  @ApiProperty({
    type: [LocationDto],
    description: 'Array of meeting locations (Zoom, custom, etc.)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  locations: LocationDto[];

  @ApiProperty({
    example: 'Asia/Dhaka',
    description: 'Timezone of the event',
  })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiPropertyOptional({
    example: 'This meeting is for discussing project updates.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiHideProperty()
  // @ApiPropertyOptional({
  //   example: 'https://calendly.com/cheerslive/nok-15-minutes',
  //   nullable: true,
  // })
  @IsOptional()
  @IsString()
  scheduling_url: string | null;

  @ApiProperty({
    example: 'en',
    description: 'Locale of the event (e.g., en, fr, es)',
  })
  @IsString()
  locale: string;

  @ApiHideProperty()
  // @ApiProperty({
  //   example: 'public',
  //   enum: ['public', 'private'],
  //   description: 'Visibility of the event type',
  // })
  @IsIn(['public', 'private'])
  @IsOptional()
  visibility: 'public' | 'private';

  @ApiHideProperty()
  // @ApiProperty({
  //   example: true,
  //   description: 'Whether the event is active or not',
  // })
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional({
    example: [15, 30, 45],
    description: 'Optional array of alternate duration options in minutes',
  })
  @IsOptional()
  @IsArray()
  duration_options?: number[];
}
