import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDetailsDto {
  @ApiPropertyOptional({
    description: 'Unique identifier (auto-generated)',
    example: 'd5a48baf-31a6-481f-8232-739a67527f1d',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'User ID (nullable if not linked to a user)',
    example: null,
  })
  user_id?: string | null;

  @ApiProperty({
    description: 'Author ID who created the payment',
    example: '2eb5c09d-fe1e-45c5-afc9-d9cb7ff023f2',
  })
  author_id: string;

  @ApiProperty({
    description: 'Total price of the payment',
    example: 25,
  })
  total_price: number;

  @ApiProperty({
    description: 'Stripe connected account ID',
    example: 'acct_1SB00e8OgTD4Rjdz',
  })
  stripeAccountId: string;
}
