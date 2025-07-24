import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCognitoService } from 'src/auth-cognito/auth-cognito.service';
import { EmailSignUpDto } from './dto/email-signup.dto';
import { User } from 'src/users/domain/user';
import { UserNotFoundException } from 'src/users/exceptions/users.exception';
import { AppException } from 'src/utils/exceptions/app.exception';
import { ErrorCode } from 'src/utils/exceptions/error-codes.enum';

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
      throw new AppException(
        'Failed to create user account',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserData(sub: string): Promise<User> {
    const user = await this.usersService.findBySub(sub);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
