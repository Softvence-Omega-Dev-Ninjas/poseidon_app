import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'List of answer choices for the question',
    type: [String],
    example: [],
  })
  @IsArray()
  @ArrayNotEmpty()
  answer_choices: string[];

  @ApiProperty({
    description: 'Indicates if the question is enabled or disabled',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description:
      'Indicates whether "other" option is included in the answer choices',
    example: true,
  })
  @IsBoolean()
  include_other: boolean;

  @ApiProperty({
    description: 'Label for the question input field',
    example: 'What is your favorite color?',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Position of the question in the survey',
    example: 1,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    description: 'Indicates if the question is required',
    example: true,
  })
  @IsBoolean()
  required: boolean;

  @ApiProperty({
    description: 'Type of the question (e.g., text, radio, checkbox)',
    example: 'text',
  })
  @IsString()
  type: string;
}
