import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './types/jwt-payload.type';
import { CurrentUser } from './types/current-user.type';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly userService: UsersService,
  ) {
    const region = configService.getOrThrow('auth.cognitoAwsRegion', {
      infer: true,
    });
    const userPoolId = configService.getOrThrow('auth.cognitoUserPoolId', {
      infer: true,
    });
    const clientId = configService.getOrThrow('auth.cognitoClientId', {
      infer: true,
    });

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
      }),
      ignoreExpiration: false,
      audience: clientId,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    const user = await this.userService.findBySub(payload.sub);

    if (!user) {
      throw new NotFoundException('User not found in database');
    }

    return {
      id: user.id,
      sub: payload.sub,
      email: user.email,
      role: user.role?.name || 'anonymous',
    };
  }
}
