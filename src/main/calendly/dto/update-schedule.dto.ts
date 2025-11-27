import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IntervalDto {
  @ApiProperty()
  @IsString()
  start_time: string;

  @ApiProperty()
  @IsString()
  end_time: string;
}

class WeeklyRuleDto {
  @ApiProperty({
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
  })
  @IsString()
  day: string;

  @ApiProperty({ type: [IntervalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntervalDto)
  intervals: IntervalDto[];
}

export class UpdateScheduleDto {
  @ApiProperty()
  @IsString()
  timezone: string;

  @ApiProperty({ type: [WeeklyRuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeeklyRuleDto)
  rules: WeeklyRuleDto[];
}
