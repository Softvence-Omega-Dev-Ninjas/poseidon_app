import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Duration {
  ONE_MONTH = 'ONE_MONTH',
  ONE_YEAR = 'ONE_YEAR',
}

export class CreateMembershipAccessToVideoCallDto {
  @ApiPropertyOptional({
    description: 'Title for video call access',
    example: 'Premium Video Calls',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of video call access benefits',
    example: 'Access to unlimited HD video calls',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Total number of video calls allowed',
    minimum: 0,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalVideoCalls?: number;

  @ApiPropertyOptional({
    description: 'Whether video calls are unlimited',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  unlimitedVideoCalls?: boolean;
}

export class CreateMembershipAccessToMessagesDto {
  @ApiPropertyOptional({
    description: 'Title for message access',
    example: 'Premium Messages',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of message access benefits',
    example: 'Direct messaging with premium features',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Total number of messages allowed',
    minimum: 0,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalMessages?: number;

  @ApiPropertyOptional({
    description: 'Whether messages are unlimited',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  unlimitedMessages?: boolean;
}

export class CreateMembershipAccessToGalleryDto {
  @ApiPropertyOptional({
    description: 'Title for gallery access',
    example: 'Exclusive Gallery',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of gallery access benefits',
    example: 'Access to premium photo gallery',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether gallery access is enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  AccessToGallery?: boolean;
}

export class CreateMembershipAccessToPostsDto {
  @ApiPropertyOptional({
    description: 'Title for posts access',
    example: 'Premium Posts',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of posts access benefits',
    example: 'Access to exclusive premium posts',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether posts access is enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  AccessToPosts?: boolean;
}

export class CreateMembershipDto {}
