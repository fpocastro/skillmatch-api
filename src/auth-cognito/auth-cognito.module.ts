import { Module } from '@nestjs/common';
import { AuthCognitoService } from './auth-cognito.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AuthCognitoService],
  exports: [AuthCognitoService],
})
export class AuthCognitoModule {}
