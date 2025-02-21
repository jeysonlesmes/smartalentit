import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MinPageIndexPipe implements PipeTransform<number, number> {
  transform(value: number, _metadata: ArgumentMetadata): number {
    if (value < 1) {
      throw new BadRequestException('pageIndex must be greater than or equal to 1');
    }
    return value;
  }
}