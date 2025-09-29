import { ApiProperty } from '@nestjs/swagger';

export class VarifyEmail {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  email: string;
}
