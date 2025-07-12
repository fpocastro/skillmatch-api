import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailSignInDto } from './dto/email-signin.dto';
import { SignInResponseDto } from './dto/signin-response.dto';
import { EmailSignUpDto } from './dto/email-signup.dto';
import { User } from 'src/user/domain/user';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin/email')
  @ApiOkResponse({
    type: SignInResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public signIn(
    @Body() emailSignInDto: EmailSignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(emailSignInDto);
  }

  @ApiCreatedResponse({
    type: User,
  })
  @Post('signup/email')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() emailSignUpDto: EmailSignUpDto): Promise<User> {
    return this.authService.signUp(emailSignUpDto);
  }
}
