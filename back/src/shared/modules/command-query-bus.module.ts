import { DynamicModule, Module, Type } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module as IModule } from '@nestjs/core/injector/module';
import { CommandQueryBus, IRequest, IRequestHandler } from '@shared/application/ports/inbound/command-query-bus.port';
import { ApplicationCommandQueryBus } from '@shared/infrastructure/adapters/inbound/application-command-query-bus.adapter';
import { COMMAND_QUERY_METADATA } from '@shared/infrastructure/decorators/command-query.decorator';

@Module({})
export class CommandQueryBusModule {
  static forRoot(): DynamicModule {
    return {
      module: CommandQueryBusModule,
      providers: [
        {
          provide: CommandQueryBus,
          useFactory: (moduleRef: ModuleRef, modulesContainer: ModulesContainer) => {
            const handlers = this.getHandlers(modulesContainer);
            return new ApplicationCommandQueryBus(handlers, moduleRef);
          },
          inject: [ModuleRef, ModulesContainer],
        },
      ],
      exports: [CommandQueryBus],
      global: true
    };
  }

  private static getHandlers(modulesContainer: ModulesContainer) {
    const handlers: Map<Type<IRequest<any>>, Type<IRequestHandler<any, any>>> = new Map();

    const modules = [...modulesContainer.values()];

    this.flatMap<IRequestHandler<any, any>>(modules, (instance) =>
      this.filterByMetadataKey(instance, COMMAND_QUERY_METADATA),
    )
      .forEach(command => {
        const handler = command.metatype as Type<IRequestHandler<any, any>>;
        const metadata = Reflect.getMetadata(COMMAND_QUERY_METADATA, handler);
        handlers.set(metadata, handler);
      });

    return handlers;
  }

  private static flatMap<T extends object>(
    modules: IModule[],
    callback: (instance: InstanceWrapper) => InstanceWrapper<any> | undefined,
  ): InstanceWrapper<T>[] {
    const items = modules
      .map((moduleRef) => [...moduleRef.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), []);
    return items.filter((item) => !!item) as InstanceWrapper<T>[];
  }

  private static filterByMetadataKey(wrapper: InstanceWrapper, metadataKey: Symbol) {
    const { instance } = wrapper;

    if (!instance?.constructor) {
      return;
    }

    const metadata = Reflect.getMetadata(metadataKey, instance.constructor);

    if (!metadata) {
      return;
    }

    return wrapper;
  }
}