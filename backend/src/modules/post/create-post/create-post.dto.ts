import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  boardId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @MaxLength(6000)
  @IsDefined()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty()
  @MaxLength(50)
  @IsString()
  @IsOptional()
  email?: string;
}
