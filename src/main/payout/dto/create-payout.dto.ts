import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePayoutDto {}

export class RedirectUrlDto {
  @ApiProperty({
    required: false,
    description: 'redirect url',
    example: 'dashboard/payout/.....',
  })
  redirect_url?: string | undefined | null;
}

export class SellerPayoutAmount {
  @ApiProperty({
    required: true,
    description: 'amount',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
