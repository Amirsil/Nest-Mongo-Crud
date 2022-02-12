import { Catch, ArgumentsHost, HttpException, HttpStatus, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
 
@Catch()
export class ValidationExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception.message === "Bad Request Exception") {
      exception.message = exception.response.message[0];
    }

    httpAdapter.reply(ctx.getResponse(), exception.message, HttpStatus.FORBIDDEN)
  }
}