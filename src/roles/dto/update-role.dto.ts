import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ type: String, example: 'admin' })
  @Type(() => String)
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    example: 'Administrator role',
    required: false,
  })
  @Type(() => String)
  @IsOptional()
  description?: string;
}
