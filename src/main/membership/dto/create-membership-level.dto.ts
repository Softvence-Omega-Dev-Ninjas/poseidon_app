import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
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

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  @IsNotEmpty()
  levelImage: Express.Multer.File;

  @ApiProperty({
    type: [CreateMembershipSubscriptionPlanDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMembershipSubscriptionPlanDto)
  subscriptionPlans: CreateMembershipSubscriptionPlanDto[];

  @ApiProperty({
    type: String,
    description: 'user notification buy membership then show wellcome_note',
    example: 'wellcome_note',
  })
  @IsOptional()
  @IsString()
  wellcome_note?: string;
}
