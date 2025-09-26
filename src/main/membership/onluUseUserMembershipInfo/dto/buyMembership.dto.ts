import { ApiProperty } from '@nestjs/swagger';
import { Duration } from '../../dto/create-membership-Access-plan-details.dto';

export class BuyMembershipDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'memberhsip time line',
    example: `${Duration.ONE_MONTH} - ${Duration.ONE_YEAR}`,
  })
  durationType: Duration;

  @ApiProperty({
    type: String,
    required: true,
    description: 'membership level id',
    example: '1234567890',
  })
  membershipLevelId: string;
}

export class BuyMembershipResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'payment intent id',
    example: 'pi_1234567890',
  })
  paymentIntentId: string;
}
