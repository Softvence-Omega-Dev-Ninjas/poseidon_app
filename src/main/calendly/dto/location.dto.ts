import {
  ApiProperty,
  ApiHideProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';

export class LocationDto {
  @ApiProperty({
    example: 'zoom_conference',
    description: 'Type of meeting location',
  })
  @IsOptional()
  @IsEnum(['zoom_conference'])
  kind: 'zoom_conference';

  @ApiHideProperty()
  // @ApiPropertyOptional({
  //   example: 'https://zoom.us/j/123456789',
  //   description: 'Meeting join URL or custom location info',
  // })
  @IsOptional()
  @IsString()
  @IsUrl()
  join_url?: string;

  // @ApiPropertyOptional({
  //   example: 'Room 204, Hospital Building',
  //   description: 'Physical or custom meeting location details',
  // })
  @IsOptional()
  @IsString()
  location?: string;
}
