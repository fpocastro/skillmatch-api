import { Injectable, Logger } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ICognitoSignUpData } from './interfaces/cognito-signup-data.interface';
import { CognitoInternalError } from './exceptions/auth-cognito.exception';

@Injectable()
export class AuthCognitoService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly logger = new Logger(AuthCognitoService.name);

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.userPoolId = this.configService.getOrThrow('auth.cognitoUserPoolId', {
      infer: true,
    });
    const awsRegion = this.configService.getOrThrow('auth.cognitoAwsRegion', {
      infer: true,
    });

    this.client = new CognitoIdentityProviderClient({
      region: awsRegion,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async signUp(signUpData: ICognitoSignUpData): Promise<string> {
    try {
      const createUserInput: AdminCreateUserCommandInput = {
        UserPoolId: this.userPoolId,
        Username: signUpData.email,
        UserAttributes: [{ Name: 'email', Value: signUpData.email }],
      };

      const createUserCommand = new AdminCreateUserCommand(createUserInput);
      const createUserResponse = await this.client.send(createUserCommand);

      const userSub = createUserResponse.User?.Username;

      if (!userSub) {
        throw new Error(JSON.stringify(createUserResponse));
      }

      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: signUpData.email,
        Password: signUpData.password,
        Permanent: true,
      });

      await this.client.send(setPasswordCommand);

      return userSub;
    } catch (e) {
      this.logger.error('Sign-up failed: ' + e);
      throw new CognitoInternalError('Failed to create user account');
    }
  }

  async getUser(sub: string) {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: sub,
      });

      const response = await this.client.send(command);

      return response.Username;
    } catch (e) {
      this.logger.error('Error retrieving user data: ' + e);
      throw new CognitoInternalError('Failed to get user data');
    }
  }
}
