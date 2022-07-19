import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
} from 'class-validator';

export class DeletePostDto {
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
  @IsDefined()
  @IsString()
  password: string;
}
