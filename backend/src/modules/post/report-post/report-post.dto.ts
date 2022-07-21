import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ReportPostDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  boardId: string;

  @ApiProperty()
  @IsDefined()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  postsIds: number[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
