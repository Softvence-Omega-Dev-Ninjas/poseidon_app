import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'OldPass@123', description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewPass@123', description: 'New password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
