import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MembershipSubscriptionPlan } from './MembershipSubscriptionPlan.dto';
import { Type } from 'class-transformer';

export class CreateMembershipLevelDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the membership level',
    example: 'Gold',
  })
  @IsString()
  @IsNotEmpty()
  levelName: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of the membership level',
    example: 'online chat',
  })
  @IsString()
  @IsNotEmpty()
  titleName: string;

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
    type: String,
    description: 'user notification buy membership then show wellcome_note',
    example: 'wellcome_note',
  })
  @IsOptional()
  @IsString()
  wellcome_note?: string | null;

  @ApiProperty({
    type: () => [MembershipSubscriptionPlan],
    description: 'Subscription plans under this membership level',
  })
  @ValidateNested({ each: true })
  @Type(() => MembershipSubscriptionPlan)
  MembershipSubscriptionPlan: MembershipSubscriptionPlan[];
}
