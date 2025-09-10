import { ApiProperty } from '@nestjs/swagger';

enum ServiceType {
  membership,
  support,
}

export class CheckOutPaymentSessionsDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The ID of the buyer',
    example: 'buyer_123',
  })
  payment_info_id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The ID of the buyer',
    example: 'buyer_123',
  })
  buyerId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The ID of the seller',
    example: 'seller_123',
  })
  sellerId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The name of the product',
    example: 'Product Name',
  })
  serviceName: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'The amount to be charged',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    type: () => ServiceType,
    required: true,
    description: 'The amount to be charged',
    example: () => ServiceType,
  })
  serviceType: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The amount to be charged',
    example: '7weg84t76wter3rt',
  })
  serviceId: string;
}
