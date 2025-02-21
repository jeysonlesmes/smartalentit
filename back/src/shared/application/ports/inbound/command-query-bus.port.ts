export abstract class CommandQueryBus {
  abstract send<TRequest extends IRequest<TResponse>, TResponse>(request: TRequest): Promise<TResponse>;
}

export interface IRequest<TResponse> { }

export interface IRequestHandler<TRequest extends IRequest<TResponse>, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}
