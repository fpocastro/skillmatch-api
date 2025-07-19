import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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

@Injectable()
export class AuthCognitoService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly logger = new Logger(AuthCognitoService.name);

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.userPoolId = this.configService.getOrThrow('auth.cognitoUserPoolId', {
      infer: true,
    });
    this.clientId = this.configService.getOrThrow('auth.cognitoClientId', {
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
        this.logger.error(
          'Sign-up failed: ' + JSON.stringify(createUserResponse),
        );
        throw new Error('User creation failed: No username returned');
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
      throw new InternalServerErrorException('Sign-up failed');
    }
  }

  async getUser(sub: string) {
    const command = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: sub,
    });

    const response = await this.client.send(command);

    return response.Username;
  }
}
