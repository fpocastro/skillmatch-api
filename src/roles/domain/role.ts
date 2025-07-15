import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, example: 'admin' })
  name: string;

  @ApiProperty({ type: String, example: 'Administrator role', required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
