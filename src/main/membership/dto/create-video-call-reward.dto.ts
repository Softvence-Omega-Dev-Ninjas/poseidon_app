import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateVideoCallRewardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalVideoCalls?: number;

  @IsOptional()
  @IsBoolean()
  unlimitedVideoCalls?: boolean;
}

// membership_ownerId
// title
// description
// totalVideoCalls
// unlimitedVideoCalls
