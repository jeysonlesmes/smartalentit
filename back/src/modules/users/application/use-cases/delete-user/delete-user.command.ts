import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class DeleteUserCommand implements IRequest<void> {
  constructor(
    public readonly id: string
  ) { }
}