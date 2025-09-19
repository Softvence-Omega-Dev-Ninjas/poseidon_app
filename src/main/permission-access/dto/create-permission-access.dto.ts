import { ApiProperty } from '@nestjs/swagger';

export class AccesPermissionAccessDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'The ID of the buyer',
    example: 'ae7d8b1a-f338-43c2-97cc-9f54ec93c77d',
  })
  buyerid: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'The ID of the seller ber girl',
    example: 'ec9bc8d9-dedb-44a5-9030-4d0a9c56fea2',
  })
  sellerid: string;
}
