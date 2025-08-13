import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoCallRewardDto {
  @ApiProperty({
    required: true,
    example: 'user-12345',
    description: 'ID of the membership owner',
  })
  @IsString()
  membership_ownerId: string;

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

// membership_ownerId
// title
// description
// totalVideoCalls
// unlimitedVideoCalls
