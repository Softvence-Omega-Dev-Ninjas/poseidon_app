import { Type } from '@nestjs/common';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

export function createDto<
  T extends Type<any>,
  K extends readonly (keyof InstanceType<T>)[],
>(BaseDto: T, required: K) {
  class RequiredDto extends PickType(
    BaseDto,
    required as unknown as string[],
  ) {}
  class PartialDto extends PartialType(BaseDto) {}

  return IntersectionType(RequiredDto, PartialDto) as Type<
    Pick<InstanceType<T>, K[number]> & Partial<InstanceType<T>>
  >;
}

/* helper to extract the *instance type* from createDto */
export type DtoType<
  T extends Type<any>,
  K extends readonly (keyof InstanceType<T>)[],
> = InstanceType<ReturnType<typeof createDto<T, K>>>;
