import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Injectable } from '@shared/infrastructure/adapters/inbound/injectable.adapter';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(
    private readonly schema: ZodSchema
  ) { }

  transform(value: any) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.errors.map(({ path, message }) => ({ path, message })));
    }

    return result.data;
  }
}
