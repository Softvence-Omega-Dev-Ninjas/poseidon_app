import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export enum Action {
  ADD = 'add',
  DELETE = 'delete',
}

export class StructuredArrayItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ enum: Action })
  @IsEnum(Action)
  @IsNotEmpty()
  action: Action;
}

export function ApiFile(fileName: string = 'file', multiple = false) {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
            nullable: multiple,
          },
        },
      },
    }),
  );
}