import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MaxPageIndexPipe implements PipeTransform<number, number> {
  transform(value: number, _metadata: ArgumentMetadata): number {
    if (value > 200) {
      throw new BadRequestException('pageIndex must be lower than or equal to 200');
    }
    return value;
  }
}