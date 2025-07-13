import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EmailSignInDto } from './dto/email-signin.dto';
import { SignInResponseDto } from './dto/signin-response.dto';
import { AuthCognitoService } from 'src/auth-cognito/auth-cognito.service';
import { EmailSignUpDto } from './dto/email-signup.dto';
import { User } from 'src/users/domain/user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authCognitoService: AuthCognitoService,
  ) {}

  async signIn(signInDto: EmailSignInDto): Promise<SignInResponseDto> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    try {
      const result = await this.authCognitoService.signIn({
        email: signInDto.email,
        password: signInDto.password,
      });

      return {
        token: result.accessToken,
        refreshToken: result.refreshToken,
        tokenExpiresIn: result.expiresIn,
        user,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async signUp(signUpDto: EmailSignUpDto): Promise<User> {
    try {
      const sub = await this.authCognitoService.signUp({
        email: signUpDto.email,
        password: signUpDto.password,
      });

      const user = await this.usersService.create({
        email: signUpDto.email,
        sub: sub,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
      });

      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
