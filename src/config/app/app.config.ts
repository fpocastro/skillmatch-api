import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Homolog = 'homolog',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  };
});
