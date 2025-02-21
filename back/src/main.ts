import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExceptionFilter } from '@shared/infrastructure/filters/exception.filter';
import { ResponseInterceptor } from '@shared/infrastructure/interceptors/response.interceptor';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (app.get(ConfigService).get<string>('CORS_ORIGIN') || '').split(','),
  });
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap();
