import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailSignUpDto {
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
    example: 'MyPassword123!',
  })
  @Type(() => String)
  @IsNotEmpty()
  password: string;

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
