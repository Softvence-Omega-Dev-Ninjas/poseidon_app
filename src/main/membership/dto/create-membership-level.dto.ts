import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMembershipLevelDto {
  @ApiProperty({
    required: true,
    description: 'ID of the membership owner',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  membershipId: string;

  @ApiProperty({
    required: true,
    description: 'Name of the membership level',
    example: 'Gold',
  })
  @IsString()
  @IsNotEmpty()
  levelName: string;

  @ApiPropertyOptional({
    required: true,
    description: 'Description of the membership level',
    example: 'Premium membership with exclusive benefits',
  })
  @IsString()
  @IsNotEmpty()
  levelDescription: string;

  @ApiProperty({
    required: true,
    description: 'URL or path to the level image',
    example: '/images/gold-level.png',
  })
  @IsString()
  @IsNotEmpty()
  levelImage: string;
}
