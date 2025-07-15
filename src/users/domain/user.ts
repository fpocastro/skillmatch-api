import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/domain/role';

export class User {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  sub: string;

  @ApiProperty({
    type: String,
    example: 'user@mail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Smith',
  })
  lastName: string;

  @ApiProperty({ type: Role })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
