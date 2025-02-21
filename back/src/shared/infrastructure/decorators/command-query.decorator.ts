import { SetMetadata, Type } from '@nestjs/common';
import { IRequest } from '@shared/application/ports/inbound/command-query-bus.port';

export const COMMAND_QUERY_METADATA = Symbol();

export function CommandQuery(command: Type<IRequest<any>>) {
  return SetMetadata(COMMAND_QUERY_METADATA, command);
}