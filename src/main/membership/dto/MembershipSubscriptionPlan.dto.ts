import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsBoolean,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Duration } from './create-membership-Access-plan-details.dto';
import { Type } from 'class-transformer';
// import { CreateMembershipSubscriptionPlanDto } from './create-membership.dto';

// Common reusable base
export class CommonPlanDetailsData {
  @ApiProperty({
    type: String,
    description: 'Subscription plan title',
    example: 'Per month 1 video call',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Subscription plan description',
    example: 'This plan allows 1 video call per month',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

// -------------------- Callig --------------------
export class CalligSubscriptionPlanDto extends CommonPlanDetailsData {
  @ApiProperty({
    type: Number,
    description: 'Total number of video calls included in the plan',
    example: 10,
  })
  @IsInt()
  @Min(0)
  totalVideoCalls: number;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the plan allows unlimited video calls',
    example: false,
  })
  @IsBoolean()
  unlimitedVideoCalls: boolean;
}

// -------------------- Messages --------------------
export class MessagesSubscriptionPlanDto extends CommonPlanDetailsData {
  @ApiProperty({
    type: Number,
    description: 'Total number of messages allowed',
    example: 100,
  })
  @IsInt()
  @Min(0)
  totalMessages: number;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the plan allows unlimited messages',
    example: false,
  })
  @IsBoolean()
  unlimitedMessages: boolean;
}

// -------------------- Gallery --------------------
export class GallerySubscriptionPlanDto extends CommonPlanDetailsData {
  @ApiProperty({
    type: Boolean,
    description: 'If true, user has access to gallery',
    example: true,
  })
  @IsBoolean()
  AccessToGallery: boolean;
}

// -------------------- Posts --------------------
export class PostsSubscriptionPlanDto extends CommonPlanDetailsData {
  @ApiProperty({
    type: Boolean,
    description: 'If true, user has access to posts',
    example: true,
  })
  @IsBoolean()
  AccessToPosts: boolean;
}

export class MembershipSubscriptionPlan {
  @ApiProperty({
    description: 'Duration of the subscription',
    enum: Duration,
    example: Duration.ONE_MONTH,
  })
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({
    description: 'Price of the subscription plan',
    example: 10.57,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  // ---------------- Nested Plans ----------------
  @ApiPropertyOptional({
    type: () => CalligSubscriptionPlanDto,
    description: 'Callig subscription plan details',
  })
  @ValidateNested()
  @Type(() => CalligSubscriptionPlanDto)
  @IsOptional()
  CalligSubscriptionPlan?: CalligSubscriptionPlanDto;

  @ApiPropertyOptional({
    type: () => MessagesSubscriptionPlanDto,
    description: 'Messages subscription plan details',
  })
  @ValidateNested()
  @Type(() => MessagesSubscriptionPlanDto)
  @IsOptional()
  MessagesSubscriptionPlan?: MessagesSubscriptionPlanDto;

  @ApiPropertyOptional({
    type: () => GallerySubscriptionPlanDto,
    description: 'Gallery subscription plan details',
  })
  @ValidateNested()
  @Type(() => GallerySubscriptionPlanDto)
  @IsOptional()
  GallerySubscriptionPlan?: GallerySubscriptionPlanDto;

  @ApiPropertyOptional({
    type: () => PostsSubscriptionPlanDto,
    description: 'Posts subscription plan details',
  })
  @ValidateNested()
  @Type(() => PostsSubscriptionPlanDto)
  @IsOptional()
  PostsSubscriptionPlan?: PostsSubscriptionPlanDto;
}

// MessagesSubscriptionPlan
// GallerySubscriptionPlan
// PostsSubscriptionPlan
