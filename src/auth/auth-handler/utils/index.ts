import { Type } from '@nestjs/common';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import slug from 'slugify';

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

export const slugify = (textContent: string, replacement: '-' | '_' = '-') =>
  slug(textContent, {
    trim: true,
    lower: true,
    strict: true,
    replacement,
    // remove all spacial characters except for replacement character
    remove: /[^\w\s-]|_/g,
  });

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
};

const obj = {
  name: 'sarif',
  age: 25,
};
omit(obj, ['age']);
// console.log();
