import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    type: String,
    example: 'Cool Soccer Field',
  })
  @Type(() => String)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'The best soccer field in town.',
  })
  @Type(() => String)
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: String,
    example: '123 Main St, Springfield, USA',
  })
  @Type(() => String)
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;
}
