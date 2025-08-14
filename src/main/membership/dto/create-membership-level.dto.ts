import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateMembershipSubscriptionPlanDto } from './create-membership.dto';

export class CreateMembershipLevelDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ID of the membership owner',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  membershipId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the membership level',
    example: 'Gold',
  })
  @IsString()
  @IsNotEmpty()
  levelName: string;

  @ApiPropertyOptional({
    type: String,
    required: true,
    description: 'Description of the membership level',
    example: 'Premium membership with exclusive benefits',
  })
  @IsString()
  @IsNotEmpty()
  levelDescription: string;

  @ApiProperty({
    type: String,
    required: true,
    format: 'binary',
    description: 'URL or path to the level image',
    example: '/images/gold-level.png',
  })
  @IsString()
  @IsNotEmpty()
  levelImage: Express.Multer.File;

  @ApiProperty({
    required: true,
    type: [CreateMembershipSubscriptionPlanDto],
    description: 'List of subscription plans for this membership level',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMembershipSubscriptionPlanDto)
  subscriptionPlans: CreateMembershipSubscriptionPlanDto[];
}
