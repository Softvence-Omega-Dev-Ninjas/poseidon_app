import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty()
  originalName: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;
}
