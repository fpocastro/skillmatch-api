import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCode } from './error-codes.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let statusCode: number;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      this.logger.error(`Unhandled exception: ${JSON.stringify(exception)}`);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (typeof message === 'object') {
      httpAdapter.reply(ctx.getResponse(), message, statusCode);
    } else {
      const errorBody = {
        message,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      };
      httpAdapter.reply(ctx.getResponse(), errorBody, statusCode);
    }
  }
}
