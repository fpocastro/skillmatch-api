import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/domain/user';

export class SignInResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpiresIn: number;

  @ApiProperty({
    type: () => User,
  })
  user: User;
}
