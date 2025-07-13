import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'test@example.com',
  })
  @Type(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  @IsEmail()
  @IsNotEmpty()
  sub: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  @Type(() => String)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Smith',
  })
  @Type(() => String)
  @IsNotEmpty()
  lastName: string;
}
