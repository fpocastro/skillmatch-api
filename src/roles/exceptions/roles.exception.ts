import { HttpStatus } from '@nestjs/common';
import { RoleErrorCode } from './roles-error-codes.enum';
import { AppException } from 'src/utils/exceptions/app.exception';

export class RoleNotFoundException extends AppException {
  constructor(message = 'Role not found') {
    super(message, HttpStatus.NOT_FOUND, RoleErrorCode.ROLE_NOT_FOUND);
  }
}

export class RoleAlreadyExistsException extends AppException {
  constructor(message = 'Role already exists') {
    super(message, HttpStatus.CONFLICT, RoleErrorCode.ROLE_ALREADY_EXISTS);
  }
}

export class InsufficientRolePermissionsException extends AppException {
  constructor(message = 'Action not allowed for this role') {
    super(
      message,
      HttpStatus.FORBIDDEN,
      RoleErrorCode.INSUFFICIENT_ROLE_PERMISSIONS,
    );
  }
}
