import { ApiProperty } from '@nestjs/swagger';

export class CreatePayoutDto {}

export class RedirectUrlDto {
  @ApiProperty({
    required: false,
    description: 'redirect url',
    example: 'dashboard/payout/.....',
  })
  redirect_url?: string | undefined | null;
}
