import { AuthController } from "@auth/infrastructure/controllers/auth.controller";
import { TokenGeneratorService } from "@auth/infrastructure/services/token-generator.service";
import { JwtStrategy } from "@auth/infrastructure/strategies/jwt.strategy";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Logger } from "@shared/application/ports/outbound/logger.port";
import { PasswordEncryption } from "@shared/application/ports/outbound/password-encryption.port";
import { BcryptPasswordEncryption } from "@shared/infrastructure/adapters/outbound/bcrypt-password-encryption.adapter";
import { InMemoryLogger } from "@shared/infrastructure/adapters/outbound/in-memory-logger.adapter";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN')
          }
        };
      }
    })
  ],
  providers: [
    {
      provide: Logger,
      useClass: InMemoryLogger
    },
    {
      provide: PasswordEncryption,
      useClass: BcryptPasswordEncryption
    },
    JwtStrategy,
    TokenGeneratorService
  ],
  controllers: [
    AuthController
  ],
  exports: [
    Logger,
    PasswordEncryption,
    JwtModule,
    TokenGeneratorService
  ]
})
export class InfrastructureModule { }