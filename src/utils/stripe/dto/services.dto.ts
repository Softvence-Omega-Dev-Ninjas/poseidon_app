import {
  IsUUID,
  IsNumber,
  IsDateString,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class PaymentDetailsDto {
  @IsUUID()
  id: string;

  @IsNumber()
  amount: number;
}

export class CreateServiceOrderDto {
  @IsUUID()
  id: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  userId: string;

  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  stripeAccountId: string;

  @IsNotEmpty()
  @IsUUID()
  sellerId: string;

  @IsDateString()
  createdAt: Date;

  paymentDetails: PaymentDetailsDto;
}
