import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

// Do Not remove this
export class LevelImageUpdateDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ID of the membership owner',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  levelImage: string;
}

// Update subscription plans
export class UpdateCalligSubscriptionPlanDto {
  @ApiProperty({
    type: String,
    description: 'Title of the video call plan',
    example: 'Per month 1 video call',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of the video call plan',
    example: 'This plan allows 1 video call per month',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Total video calls allowed',
    example: 10,
  })
  @IsNumber()
  totalVideoCalls: number;

  @ApiProperty({
    type: Boolean,
    description: 'Whether unlimited video calls are allowed',
    example: false,
  })
  @IsBoolean()
  unlimitedVideoCalls: boolean;
}

export class UpdateMessagesSubscriptionPlanDto {
  @ApiProperty({
    type: String,
    description: 'Title of the messages plan',
    example: 'Per month 100 messages',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of the messages plan',
    example: 'This plan allows 100 messages per month',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Total messages allowed',
    example: 100,
  })
  @IsNumber()
  totalMessages: number;

  @ApiProperty({
    type: Boolean,
    description: 'Whether unlimited messages are allowed',
    example: false,
  })
  @IsBoolean()
  unlimitedMessages: boolean;
}

export class UpdateGallerySubscriptionPlanDto {
  @ApiProperty({
    type: String,
    description: 'Title of the gallery access plan',
    example: 'Gallery access per month',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of the gallery plan',
    example: 'Access to gallery per month',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether access to gallery is allowed',
    example: true,
  })
  @IsBoolean()
  AccessToGallery: boolean;
}

export class UpdatePostsSubscriptionPlanDto {
  @ApiProperty({
    type: String,
    description: 'Title of the posts access plan',
    example: 'Posts access per month',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of the posts plan',
    example: 'Access to posts per month',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether access to posts is allowed',
    example: true,
  })
  @IsBoolean()
  AccessToPosts: boolean;
}

// Membership subscription plan
export class UpdateMembershipSubscriptionPlanDto {
  @ApiProperty({
    type: String,
    description: 'ID of the membership subscription plan',
    example: '91ffdf09-4a2e-4447-9727-089f959e9d54',
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'Duration of the plan',
    example: 'ONE_MONTH',
    enum: ['ONE_MONTH', 'ONE_YEAR'],
  })
  @IsString()
  duration: 'ONE_MONTH' | 'ONE_YEAR';

  @ApiProperty({
    type: Number,
    description: 'Price of the plan',
    example: 10.57,
  })
  @IsNumber()
  price: number;

  @ApiProperty({ type: UpdateCalligSubscriptionPlanDto, required: false })
  @IsOptional()
  CalligSubscriptionPlan?: UpdateCalligSubscriptionPlanDto;

  @ApiProperty({ type: UpdateMessagesSubscriptionPlanDto, required: false })
  @IsOptional()
  MessagesSubscriptionPlan?: UpdateMessagesSubscriptionPlanDto;

  @ApiProperty({ type: UpdateGallerySubscriptionPlanDto, required: false })
  @IsOptional()
  GallerySubscriptionPlan?: UpdateGallerySubscriptionPlanDto;

  @ApiProperty({ type: UpdatePostsSubscriptionPlanDto, required: false })
  @IsOptional()
  PostsSubscriptionPlan?: UpdatePostsSubscriptionPlanDto;
}

// Membership level
export class UpdateMembershipLevelDto {
  @ApiProperty({
    type: String,
    description: 'ID of the membership level',
    example: '91ffdf09-4a2e-4447-9727-089f959e9d54',
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'Name of the membership level',
    example: 'Gold',
  })
  @IsString()
  levelName: string;

  @ApiProperty({
    type: String,
    description: 'Title name of the membership level',
    example: 'Premium Membership',
  })
  @IsString()
  titleName: string;

  @ApiProperty({
    type: String,
    description: 'Description of the membership level',
    example: 'Premium membership with exclusive benefits',
    required: false,
  })
  @IsOptional()
  @IsString()
  levelDescription?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'ID of the level image',
    example: '679b649f-75ee-49bd-80ec-ac7bf7f49be2',
  })
  @IsString()
  @IsOptional()
  levelImage?: string;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Whether the level is public',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({
    required: false,
    type: [UpdateMembershipSubscriptionPlanDto],
    description: 'List of subscription plans for this membership level',
  })
  MembershipSubscriptionPlan?: UpdateMembershipSubscriptionPlanDto[];

  @ApiProperty({
    type: String,
    description: 'Welcome note for the membership level',
    required: false,
  })
  @IsOptional()
  @IsString()
  Wellcome_note?: string;
}

// export class UpdateCalligSubscriptionPlanDto {
//   // id: string;
//   // duration: 'ONE_MONTH' | 'ONE_YEAR';
//   title: string;
//   description: string;
//   totalVideoCalls: number;
//   unlimitedVideoCalls: boolean;
// }

// export class UpdateMessagesSubscriptionPlanDto {
//   // id: string;
//   // duration: 'ONE_MONTH' | 'ONE_YEAR';
//   title: string;
//   description: string;
//   totalMessages: number;
//   unlimitedMessages: boolean;
// }

// export class UpdateGallerySubscriptionPlanDto {
//   // id: string;
//   // duration: 'ONE_MONTH' | 'ONE_YEAR';
//   title: string;
//   description: string;
//   AccessToGallery: boolean;
// }

// export class UpdatePostsSubscriptionPlanDto {
//   // id: string;
//   // duration: 'ONE_MONTH' | 'ONE_YEAR';
//   title: string;
//   description: string;
//   AccessToPosts: boolean;
// }

// export class UpdateMembershipSubscriptionPlanDto {
//   id: string;
//   duration: 'ONE_MONTH' | 'ONE_YEAR';
//   price: number;
//   CalligSubscriptionPlan?: UpdateCalligSubscriptionPlanDto;
//   MessagesSubscriptionPlan?: UpdateMessagesSubscriptionPlanDto;
//   GallerySubscriptionPlan?: UpdateGallerySubscriptionPlanDto;
//   PostsSubscriptionPlan?: UpdatePostsSubscriptionPlanDto;
// }

// export class UpdateMembershipLevelDto {
//   id: string;
//   levelName: string;
//   titleName: string;
//   levelDescription?: string;
//   levelImage: string;
//   isPublic: boolean;
//   MembershipSubscriptionPlan: UpdateMembershipSubscriptionPlanDto[];
//   Wellcome_note?: string;
// }
