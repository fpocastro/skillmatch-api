import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    example: 'user@mail.com',
  })
  @Type(() => String)
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  @Type(() => String)
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    example: 'Smith',
  })
  @Type(() => String)
  @IsOptional()
  lastName?: string;
}
