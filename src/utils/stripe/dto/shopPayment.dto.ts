import { ApiProperty } from '@nestjs/swagger';

export class ShopPaymentDto {
  @ApiProperty()
  stripeAccountId: string;

  @ApiProperty()
  paymentDetailsId: string;

  @ApiProperty()
  shopOrderId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  email?: string;
}
