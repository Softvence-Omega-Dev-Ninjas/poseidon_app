import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Duration {
  ONE_MONTH = 'ONE_MONTH',
  ONE_YEAR = 'ONE_YEAR',
}

export class CreateMembershipLevelDto {
  @ApiProperty({ description: 'Name of the membership level', example: 'Gold' })
  @IsString()
  @IsNotEmpty()
  levelName: string;

  @ApiPropertyOptional({
    description: 'Description of the membership level',
    example: 'Premium membership with exclusive benefits',
  })
  @IsOptional()
  @IsString()
  levelDescription?: string;

  @ApiProperty({
    description: 'URL or path to the level image',
    example: '/images/gold-level.png',
  })
  @IsString()
  @IsNotEmpty()
  levelImage: string;
}

export class CreateMembershipSubscriptionPlanDto {
  @ApiProperty({
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({
    description: 'Price of the subscription plan',
    minimum: 0,
    example: 29.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'ID of the video call access configuration',
    example: 'video-call-123',
  })
  @IsOptional()
  @IsString()
  membershipAccessToVideoCallId?: string;

  @ApiPropertyOptional({
    description: 'ID of the gallery access configuration',
    example: 'gallery-123',
  })
  @IsOptional()
  @IsString()
  membershipAccessGalleryId?: string;

  @ApiPropertyOptional({
    description: 'ID of the posts access configuration',
    example: 'posts-123',
  })
  @IsOptional()
  @IsString()
  membershipAccessToPostsId?: string;

  @ApiPropertyOptional({
    description: 'ID of the messages access configuration',
    example: 'messages-123',
  })
  @IsOptional()
  @IsString()
  membershipAccessToMessagesId?: string;
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

export class CreateMembershipDto {
  @ApiPropertyOptional({
    description: 'Array of membership levels to create',
    type: [CreateMembershipLevelDto],
  })
  @IsOptional()
  membershipLevels?: CreateMembershipLevelDto[];

  @ApiPropertyOptional({
    description: 'Array of video call access configurations',
    type: [CreateMembershipAccessToVideoCallDto],
  })
  @IsOptional()
  accessToVideoCall?: CreateMembershipAccessToVideoCallDto[];

  @ApiPropertyOptional({
    description: 'Array of message access configurations',
    type: [CreateMembershipAccessToMessagesDto],
  })
  @IsOptional()
  accessToMessages?: CreateMembershipAccessToMessagesDto[];

  @ApiPropertyOptional({
    description: 'Array of gallery access configurations',
    type: [CreateMembershipAccessToGalleryDto],
  })
  @IsOptional()
  accessToGallery?: CreateMembershipAccessToGalleryDto[];

  @ApiPropertyOptional({
    description: 'Array of posts access configurations',
    type: [CreateMembershipAccessToPostsDto],
  })
  @IsOptional()
  accessToPosts?: CreateMembershipAccessToPostsDto[];
}
