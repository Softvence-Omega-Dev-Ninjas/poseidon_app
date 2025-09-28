import { ApiProperty } from '@nestjs/swagger';

export class PiStripeId {
  @ApiProperty({
    type: String,
    required: true,
    description: 'payment intent id',
    example: 'pi_1234567890',
  })
  paymentIntentId: string;
}
