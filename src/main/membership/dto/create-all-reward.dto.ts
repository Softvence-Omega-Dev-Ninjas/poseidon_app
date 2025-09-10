import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Duration } from './create-membership-Access-plan-details.dto';
import { Type } from 'class-transformer';

export class CreateVideoCallRewardDto {
  @ApiProperty({
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({
    required: false,
    example: 'Premium Video Call Package',
    description: 'Title of the video call reward',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    example: 'Get unlimited video calls with premium membership',
    description: 'Description of the video call reward',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'Total number of video calls allowed',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalVideoCalls?: number;

  @ApiProperty({
    required: false,
    example: true,
    description: 'Whether unlimited video calls are allowed',
  })
  @IsOptional()
  @IsBoolean()
  unlimitedVideoCalls?: boolean;
}

export class CreateMembershipAccessToMessagesDto {
  @ApiProperty({
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({
    required: false,
    example: 'Premium Messages Access',
    description: 'Title of the messages access reward',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    example: 'Get unlimited messages with premium membership',
    description: 'Description of the messages access reward',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: 50,
    description: 'Total number of messages allowed',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalMessages?: number;

  @ApiProperty({
    required: false,
    example: true,
    description: 'Whether unlimited messages are allowed',
  })
  @IsOptional()
  @IsBoolean()
  unlimitedMessages?: boolean;
}

export class CreateMembershipAccessToGalleryDto {
  @ApiProperty({
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({
    required: false,
    example: 'Premium Gallery Access',
    description: 'Title of the gallery access reward',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    example: 'Get full access to exclusive gallery content',
    description: 'Description of the gallery access reward',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: true,
    description: 'Whether access to gallery is granted',
  })
  @IsOptional()
  @IsBoolean()
  AccessToGallery?: boolean;
}

export class CreateMembershipAccessToPostsDto {
  @ApiProperty({
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({
    required: false,
    example: 'Premium Posts Access',
    description: 'Title of the posts access reward',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    example: 'Get full access to exclusive posts content',
    description: 'Description of the posts access reward',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: true,
    description: 'Whether access to posts is granted',
  })
  @IsOptional()
  @IsBoolean()
  AccessToPosts?: boolean;
}

export class CreateAllRewardsDto {
  @ApiProperty({
    required: false,
    description: 'Video call reward configuration',
    type: CreateVideoCallRewardDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVideoCallRewardDto)
  videoCallReward?: CreateVideoCallRewardDto;

  @ApiProperty({
    required: false,
    description: 'Messages access reward configuration',
    type: CreateMembershipAccessToMessagesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMembershipAccessToMessagesDto)
  messagesReward?: CreateMembershipAccessToMessagesDto;

  @ApiProperty({
    required: false,
    description: 'Gallery access reward configuration',
    type: CreateMembershipAccessToGalleryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMembershipAccessToGalleryDto)
  galleryReward?: CreateMembershipAccessToGalleryDto;

  @ApiProperty({
    required: false,
    description: 'Posts access reward configuration',
    type: CreateMembershipAccessToPostsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMembershipAccessToPostsDto)
  postsReward?: CreateMembershipAccessToPostsDto;
}

export class WhoCreateReward {
  @ApiProperty({
    required: true,
    example: 'url params',
  })
  @IsNotEmpty()
  @IsString()
  WhoCreateReward: string;

  @ApiProperty({
    required: true,
    description: 'Posts access reward configuration',
    type:
      CreateVideoCallRewardDto ||
      CreateMembershipAccessToMessagesDto ||
      CreateMembershipAccessToGalleryDto ||
      CreateMembershipAccessToPostsDto,
  })
  rewardData:
    | CreateVideoCallRewardDto
    | CreateMembershipAccessToMessagesDto
    | CreateMembershipAccessToGalleryDto
    | CreateMembershipAccessToPostsDto;
}
