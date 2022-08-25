import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator';

export class LockThreadDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  boardId: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsBoolean()
  lock: boolean;
}
