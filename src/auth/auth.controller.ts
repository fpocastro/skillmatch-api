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
import { EmailSignUpDto } from './dto/email-signup.dto';
import { User } from 'src/users/domain/user';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from './strategies/types/authenticated-request.type';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  me(@Request() request: AuthenticatedRequest): Promise<User> {
    return this.authService.getUserData(request.user.sub);
  }
}
