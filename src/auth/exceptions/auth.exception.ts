import { HttpStatus } from '@nestjs/common';
import { AuthErrorCode } from './auth-error-codes.enum';
import { AppException } from 'src/utils/exceptions/app.exception';

export class InvalidCredentialsException extends AppException {
  constructor(message = 'Invalid credentials') {
    super(message, HttpStatus.NOT_FOUND, AuthErrorCode.INVALID_CREDENTIALS);
  }
}

export class TokenExpiredException extends AppException {
  constructor(message = 'Token expired') {
    super(message, HttpStatus.UNAUTHORIZED, AuthErrorCode.TOKEN_EXPIRED);
  }
}

export class UnauthorizedAccessException extends AppException {
  constructor(message = 'Action not allowed for this user') {
    super(message, HttpStatus.UNAUTHORIZED, AuthErrorCode.UNAUTHORIZED_ACCESS);
  }
}
