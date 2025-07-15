import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ type: String, example: 'admin' })
  @Type(() => String)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Administrator role',
    required: false,
  })
  @Type(() => String)
  @IsOptional()
  description?: string;
}
