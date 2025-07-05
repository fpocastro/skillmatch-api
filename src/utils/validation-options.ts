import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

interface ValidationErrorTree {
  [key: string]: string | ValidationErrorTree;
}

function generateErrors(errors: ValidationError[]): ValidationErrorTree {
  return errors.reduce<ValidationErrorTree>((acc, error) => {
    const key = error.property;
    const hasChildren = error.children && error.children.length > 0;

    const value = hasChildren
      ? generateErrors(error.children!)
      : Object.values(error.constraints ?? {}).join(', ');

    acc[key] = value;
    return acc;
  }, {});
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

export default validationOptions;
