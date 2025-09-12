import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class StringToBooleanPipe implements PipeTransform {
  transform(value: any) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new BadRequestException(`Invalid boolean string: ${value}`);
  }
}
