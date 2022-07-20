import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength } from 'class-validator';

export class CreateWordfilterDto {
  @ApiProperty()
  @IsDefined()
  @MaxLength(255)
  @IsString()
  input: string;

  @ApiProperty()
  @IsDefined()
  @MaxLength(255)
  @IsString()
  output: string;
}
