import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
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
      if (err instanceof HttpException) {
        throw err;
      }
      this.logger.error('Error creating user account: ' + JSON.stringify(err));
      throw new InternalServerErrorException(err);
    }
  }

  async getUserData(sub: string): Promise<User> {
    const user = await this.usersService.findBySub(sub);

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    return user;
  }
}
