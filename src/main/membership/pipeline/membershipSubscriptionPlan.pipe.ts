import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MembershipSubscriptionPlanPipe implements PipeTransform {
  transform(value: any) {
    if (!value)
      throw new BadRequestException(
        ' MembershipSubscriptionPlan Invalid please fill',
      );

    try {
      // If already object/array, return as is
      if (typeof value === 'object')
        throw new BadRequestException(
          '  Please fill MembershipSubscriptionPlan Current Data',
        );

      // Parse string to JSON
      return JSON.parse(value);
    } catch {
      throw new BadRequestException(
        'Invalid JSON format for MembershipSubscriptionPlan',
      );
    }
  }
}
