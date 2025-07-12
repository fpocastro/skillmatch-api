import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/domain/user';

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
