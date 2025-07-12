import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  COGNITO_AWS_REGION: string;

  @IsString()
  COGNITO_USER_POOL_ID: string;

  @IsString()
  COGNITO_CLIENT_ID: string;

  @IsString()
  COGNITO_CLIENT_SECRET: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    cognitoAwsRegion: process.env.COGNITO_AWS_REGION,
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
    cognitoClientId: process.env.COGNITO_CLIENT_ID,
    cognitoClientSecret: process.env.COGNITO_CLIENT_SECRET,
  };
});
