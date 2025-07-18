/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailSignInDto } from './dto/email-signin.dto';
import { SignInResponseDto } from './dto/signin-response.dto';
import { EmailSignUpDto } from './dto/email-signup.dto';
import { User } from 'src/users/domain/user';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  public signUp(@Body() emailSignUpDto: EmailSignUpDto): Promise<User> {
    return this.authService.signUp(emailSignUpDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: User,
  })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  findOne(@Request() request): Promise<User> {
    return this.authService.getUserData(request.user.sub);
  }
}
