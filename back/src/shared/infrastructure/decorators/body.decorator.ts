import { Body as NestBody } from '@nestjs/common';
import { ZodValidationPipe } from '@shared/infrastructure/pipes/zod-validation.pipe';
import { ZodSchema } from 'zod';

const ZodBody = (schema: ZodSchema) => NestBody(new ZodValidationPipe(schema));

export const Body = ZodBody;