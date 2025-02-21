import { forMember, mapFrom, mapWith } from "@automapper/core";
import { RoleDto } from "@shared/application/dtos/role.dto";
import { UserWithPasswordDto } from "@shared/application/dtos/user-with-password.dto";
import { UserDto } from "@shared/application/dtos/user.dto";
import { AutoMapper } from "@shared/infrastructure/adapters/outbound/auto-mapper.adapter";
import { Role } from "@users/domain/entities/role.entity";
import { User } from "@users/domain/entities/user.entity";

export const configureMappingProfile = (autoMapper: AutoMapper): void => {
  autoMapper.createMap(
    Role,
    RoleDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.code,
      mapFrom(source => source.code.value())
    )
  );

  autoMapper.createMap(
    User,
    UserDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.name,
      mapFrom(source => source.name.value())
    ),
    forMember(
      destination => destination.email,
      mapFrom(source => source.email.value())
    ),
    forMember(
      destination => destination.role,
      mapWith(RoleDto, Role, (source) => source.role)
    ),
    forMember(
      destination => destination.createdAt,
      mapFrom(source => source.createdAt)
    ),
    forMember(
      destination => destination.updatedAt,
      mapFrom(source => source.updatedAt)
    )
  );

  autoMapper.createMap(
    User,
    UserWithPasswordDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.name,
      mapFrom(source => source.name.value())
    ),
    forMember(
      destination => destination.email,
      mapFrom(source => source.email.value())
    ),
    forMember(
      destination => destination.role,
      mapWith(RoleDto, Role, (source) => source.role)
    ),
    forMember(
      destination => destination.password,
      mapFrom(source => source.password.value())
    ),forMember(
      destination => destination.createdAt,
      mapFrom(source => source.createdAt)
    ),
    forMember(
      destination => destination.updatedAt,
      mapFrom(source => source.updatedAt)
    )
  );
};