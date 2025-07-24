import { HttpStatus } from '@nestjs/common';
import { UserErrorCode } from './users-error-codes.enum';
import { AppException } from 'src/utils/exceptions/app.exception';

export class UserNotFoundException extends AppException {
  constructor(message = 'User not found') {
    super(message, HttpStatus.NOT_FOUND, UserErrorCode.USER_NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends AppException {
  constructor(message = 'User already exists') {
    super(message, HttpStatus.CONFLICT, UserErrorCode.USER_ALREADY_EXISTS);
  }
}
