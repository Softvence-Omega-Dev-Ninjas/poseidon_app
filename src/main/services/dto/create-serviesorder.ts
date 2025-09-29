import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceOrderDto {
  @ApiProperty({
    description: 'ID of the service being ordered',
  })
  @IsString()
  @IsNotEmpty()
  serviceId: string;
}
