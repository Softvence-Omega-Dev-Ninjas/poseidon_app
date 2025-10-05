import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

class AppointmentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  supporterId: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  requestedTime: string; // ISO string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
export class CreateAppointmentDto extends IntersectionType(AppointmentDto) {}
