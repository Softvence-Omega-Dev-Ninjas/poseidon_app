import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Duration } from './create-membership.dto';

export class CreateMembershipSubscriptionPlanDto {
  @ApiProperty({
    required: false,
    description: 'ID of the membership level',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsUUID()
  membershipLevelId?: string;

  @ApiProperty({
    required: true,
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  @IsNotEmpty()
  duration: Duration;

  @ApiProperty({
    required: true,
    description: 'Price of the subscription plan',
    minimum: 0,
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'ID of the video call access configuration',
    example: 'video-call-123',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  membershipAccessToVideoCallId?: string;

  @ApiPropertyOptional({
    description: 'ID of the gallery access configuration',
    example: 'gallery-123',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  membershipAccessGalleryId?: string;

  @ApiPropertyOptional({
    description: 'ID of the posts access configuration',
    example: 'posts-123',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  membershipAccessToPostsId?: string;

  @ApiPropertyOptional({
    description: 'ID of the messages access configuration',
    example: 'messages-123',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  membershipAccessToMessagesId?: string;
}
