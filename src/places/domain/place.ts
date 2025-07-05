import { ApiProperty } from '@nestjs/swagger';

export class Place {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Cool Soccer Field',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'The best soccer field in town.',
  })
  description?: string;

  @ApiProperty({
    type: String,
    example: '123 Main St, Springfield, USA',
  })
  address: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
