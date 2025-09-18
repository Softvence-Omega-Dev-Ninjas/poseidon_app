import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionAccessDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'The ID of the buyer',
    example: '1234567890',
  })
  buyerid: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'The ID of the seller ber girl',
    example: '1234567890',
  })
  sellerid: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'access last time',
    example: '2025-09-18',
  })
  endDate: string;
}
