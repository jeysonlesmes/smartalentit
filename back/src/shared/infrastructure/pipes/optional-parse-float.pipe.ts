import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { Injectable } from '@shared/infrastructure/adapters/inbound/injectable.adapter';

@Injectable()
export class OptionalParseFloatPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      return undefined;
    }

    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('Validation failed (numeric string is expected)');
    }

    return parsedValue;
  }
}