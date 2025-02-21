import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import { BusinessException } from '@shared/domain/exceptions/business.exception';
import { Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Array<any>;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;

      if (status === HttpStatus.BAD_REQUEST) {
        message = response?.error ?? 'Bad Request';
        
        errors = Array.isArray(response?.message) ? response?.message : [{ message: response?.message }];
      } else {
        message = response?.message ?? getReasonPhrase(exception.getStatus());
      }
    } else if (exception instanceof BusinessException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      successful: false,
      statusCode: status,
      errors,
      message,
      timestamp: new Date().toISOString()
    });
  }
}