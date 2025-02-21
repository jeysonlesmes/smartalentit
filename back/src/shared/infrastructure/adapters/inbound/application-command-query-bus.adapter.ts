import { Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { CommandQueryBus, IRequest, IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";

export class ApplicationCommandQueryBus implements CommandQueryBus {
  constructor(
    private readonly handlerMap: Map<Type<IRequest<any>>, Type<IRequestHandler<any, any>>>,
    private readonly moduleRef: ModuleRef
  ) { }

  async send<TRequest, TResponse>(request: TRequest): Promise<TResponse> {
    const requestType = request.constructor as Type<TRequest>;
    const handlerType = this.handlerMap.get(requestType);

    if (!handlerType) {
      throw new Error(`No handler found for request of type ${requestType.name}`);
    }

    const handler = await this.moduleRef.resolve(handlerType, undefined, { strict: false });

    return handler.handle(request);
  }
}