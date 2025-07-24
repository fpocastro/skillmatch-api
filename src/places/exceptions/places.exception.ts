import { HttpStatus } from '@nestjs/common';
import { PlaceErrorCode } from './places-error-codes.enum';
import { AppException } from 'src/utils/exceptions/app.exception';

export class PlaceNotFoundException extends AppException {
  constructor(message = 'Place not found') {
    super(message, HttpStatus.NOT_FOUND, PlaceErrorCode.PLACE_NOT_FOUND);
  }
}
