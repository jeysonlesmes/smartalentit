import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from '@shared/application/ports/outbound/cache.port';
import { Injectable } from '@shared/infrastructure/adapters/inbound/injectable.adapter';
import { CACHE_TTL_KEY } from '@shared/infrastructure/decorators/cache-ttl.decorator';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly defaultTtl = 300;

  constructor(
    private readonly cache: Cache,
    private readonly reflector: Reflector
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const cacheKey = this.generateCacheKey(request);

    const ttl = this.reflector.get<number>(
      CACHE_TTL_KEY,
      context.getHandler(),
    ) || this.defaultTtl;

    const cachedResponse = await this.cache.get(cacheKey);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.cache.set(cacheKey, response, ttl);
      })
    );
  }

  private generateCacheKey(request: Request): string {
    const { method, originalUrl, params, query } = request;

    const serializedParams = JSON.stringify(params);
    const serializedQuery = JSON.stringify(query);

    return `${method}:${originalUrl}:${serializedParams}:${serializedQuery}`;
  }
}
