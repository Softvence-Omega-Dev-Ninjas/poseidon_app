import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { StructuredArrayItemDto } from 'src/common/dto/structured-array.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(OmitType(CreatePostDto, ['images'])) {
  @ApiProperty({ type: [StructuredArrayItemDto], description: 'Array of image URLs with actions' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructuredArrayItemDto)
  images?: StructuredArrayItemDto[];
}
