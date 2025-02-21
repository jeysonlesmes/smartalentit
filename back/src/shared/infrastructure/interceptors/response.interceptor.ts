import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResponseDto } from '@shared/infrastructure/dtos/response.dto';
import { Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(body => this.getContent(body, context)));
  }

  private getContent(data: any, context: ExecutionContext): ResponseDto<any> {
    const res = context.switchToHttp().getResponse<Response>();

    return {
      successful: true,
      statusCode: res.statusCode,
      message: getReasonPhrase(res.statusCode),
      data,
      timestamp: new Date().toISOString()
    };
  }
}