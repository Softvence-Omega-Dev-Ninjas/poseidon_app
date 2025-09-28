import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsDateString } from 'class-validator';

export class PaymentDetailsDto {
  @ApiProperty({
    description: 'Unique ID of the payment details',
    example: '383f7970-1894-46cd-9a5c-7a7c8d2c41ae',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Payment amount', example: 72 })
  @IsNumber()
  amount: number;
}

export class CreateServiceOrderDto {
  @ApiProperty({
    description: 'Unique ID of the service order',
    example: '00a4bfcd-dd61-4b81-be67-4b1b72f684c3',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Service ID associated with the order',
    example: 'd17491fe-f444-497d-85ea-318df8f387e8',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: '19829616-cfa8-41ac-8301-0e53af7021d7',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: 'mf dharif',
  })
  name?: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: 'acct_se76gbfew74b6',
  })
  stripeAccountId: string;

  @ApiProperty({
    description: 'Seller ID associated with the order',
    example: 'f6b8529b-593a-4476-a471-5f1999045a86',
  })
  @IsUUID()
  sellerId: string;

  @ApiProperty({
    description: 'Order creation timestamp',
    example: '2025-09-28T16:51:42.739Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    type: () => PaymentDetailsDto,
    description: 'Details of the payment for this order',
  })
  paymentDetails: PaymentDetailsDto;
}
