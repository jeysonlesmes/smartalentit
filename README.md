# Project Documentation

## Preview
- You can access to the application at url: http://3.141.202.187/
- Credentials:
  - Email: info@smartalentit.com
  - Password: p4assW@rd

This preview is deployed at AWS EC2, ensure you access via `http` and not `https` due it protocol is not allowed and it could generate error.

## Overview
This project is a full-stack application consisting of a frontend and a backend. The frontend is built using **Angular** with **NG-ZORRO** for UI components, while the backend is developed using **NestJS** and follows the **Hexagonal Architecture** pattern. The backend is designed to be highly modular, with support for multiple persistence layers, including **MongoDB**, **MySQL**, and **InMemory** repositories.

---

## Technologies Used

### Backend
- **NestJS**: A progressive Node.js framework for building efficient, scalable, and maintainable server-side applications.
- **Hexagonal Architecture**: Also known as Ports and Adapters, this architecture promotes separation of concerns, making the application more modular, testable, and adaptable to changes.
- **MongoDB**: The primary database used for persistence.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.

---

## Architecture

### Hexagonal Architecture
The backend is built using **Hexagonal Architecture**, which separates the core business logic from external concerns like databases, APIs, and frameworks. This architecture ensures that the application is modular, testable, and easy to maintain. The key components of this architecture are:

1. **Core**:
   - Contains the business logic and domain models.
   - Defines use cases, entities, value objects, and domain events.
   - Completely independent of external systems like databases or frameworks.

2. **Ports**:
   - Interfaces that define how the core interacts with external systems.
   - Examples include repository interfaces for data access or service interfaces for external APIs.

3. **Adapters**:
   - Implementations of the ports.
   - Examples include:
     - **MongoDB Adapter**: Implements the repository interface for MongoDB.

        There are technical details I want to explain to demonstrate compliance with **Hexagonal Architecture**, where small design decisions make a significant difference in the application's design. In this case, I will use the **MongoDB schemas** as an example, specifically the `products` schema.

        ### Key Design Decision: Avoiding Default MongoDB `_id`
        In MongoDB, documents are assigned a default `_id` field, which is an `ObjectId`. However, in our **domain**, we established that all IDs must be **UUIDs** (Universally Unique Identifiers). Using the default `_id` would tightly couple our domain to an external dependency (MongoDB), which violates the principles of Hexagonal Architecture.

        To avoid this coupling:
        - **Custom ID Field**: Instead of relying on MongoDB's `_id`, we introduced a custom field called `productId` in the schema. This field is controlled entirely by our application, ensuring no external dependencies.
        - **ProductMapper**: The `ProductMapper` is responsible for handling the conversion between the domain entity (using UUIDs) and the MongoDB schema (using `productId`). This ensures that the **business logic remains unaffected** by database-specific details.

        ### Example: `products` Schema in MongoDB
        Here’s how the `products` schema is designed to comply with Hexagonal Architecture:

        ```ts
        @Schema({ timestamps: true })
        export class Product extends Document {
          @Prop({ unique: true })
          productId: string; // Custom ID field

          @Prop({ required: true })
          name: string;

          @Prop({ required: true })
          description: string;

          @Prop({ required: true, type: Types.Decimal128 })
          price: Types.Decimal128;

          @Prop({ required: true })
          stock: number;

          @Prop({ type: StatusSchema, required: true })
          status: Status;

          @Prop()
          createdAt: Date;

          @Prop()
          updatedAt: Date;
        }
        ```
        ### Why This Matters
        - **Decoupling**: By avoiding the default `_id` and using a custom `productId`, we ensure that our domain logic is not tied to MongoDB's implementation details.
        - **Flexibility**: This design allows us to switch to another database (e.g., MySQL, in-memory) without modifying the core business logic.
        - **Maintainability**: The `ProductMapper` encapsulates all database-specific logic, making the codebase easier to maintain and test.

        ### Role of the `ProductMapper`
        The `ProductMapper` acts as a bridge between the domain and the database. It handles:
        - **Mapping**: Converts domain entities (using UUIDs) to database schemas (using `productId`) and vice versa.
        - **Encapsulation**: Hides database-specific details from the core business logic.

        Example of `ProductMapper`:
        ```ts
        export class ProductMapper {
          static toDomain(persistence: ProductDocument): Product {
            return new Product(
              new ProductId(persistence.productId), // Map productId to domain ID
              new Name(persistence.name),
              new Description(persistence.description),
              new Price(parseFloat(persistence.price.toString())),
              new Stock(persistence.stock),
              StatusMapper.toDomain(persistence.status),
              persistence.createdAt,
              persistence.updatedAt
            );
          }

          static toPersistence(domain: Product): ProductDocument {
            return {
              productId: domain.id.value(), // Map domain ID to productId
              name: domain.name.value(),
              description: domain.description.value(),
              price: new Types.Decimal128(domain.price.value().toString()),
              stock: domain.stock.value(),
              status: StatusMapper.toPersistence(domain.status),
              createdAt: domain.createdAt,
              updatedAt: domain.updatedAt
            } as ProductDocument;
          }
        }
        ```
     - **MySQL Adapter**: Implements the repository interface for MySQL.

       This adapter is proposed to allow testing the functionality of the products module with a MySQL database without affecting the business logic. In this approach, two example tables are considered: products and statuses, taking into account that a product has a relationship with a status through the column status_id, as is typical in a relational database. The repository is responsible for handling all this work, providing the methods as required by the contract, in this case: ProductRepository. Here, the ProductMapper for MySQL is responsible for performing the respective mapping between the database entity and the domain entity, without affecting the repository and ensuring separation of responsibilities.

       To change the `ProductRepository` adapter you can edit the Product `PersistenceModule` and then:
       ```ts
        // Add this imports
        import { MysqlModule } from "@products/infrastructure/persistence/mysql/mysql.module";
        import { MysqlProductRepository } from "@products/infrastructure/persistence/mysql/repositories/mysql-product.repository";

        @Module({
          imports: [
            MongoDbModule,
            MysqlModule // Import the MysqlModule
          ],
          providers: [
            {
              provide: ProductRepository,
              useClass: MysqlProductRepository // Change MongoDbProductRepository for MysqlProductRepository
            },
            {
              provide: StatusRepository,
              useClass: InMemoryStatusRepository
            }
          ],
          exports: [
            ProductRepository,
            StatusRepository
          ]
        })
        export class PersistenceModule { }
       ```
       With this changes the product module should works without any problem! 
     - **In-Memory Adapter**: Implements the repository interface for in-memory storage, useful for testing and development.

       I propose this adapter for the `roles` and `statuses` modules, with the premise that they can be extended later. For example, there could be more roles in our application (admin, user, moderator, support, analyst, auditor, etc.) and similarly more statuses (active, inactive, draft, discontinued, archived, restricted, expired, etc.). Under this logic, the backend exposes endpoints to query the different data and use them for creation, editing, and reading. Additionally, the backend is responsible for validating that the data exists, and I achieve this using in-memory repositories since, for now, the data is fixed. However, this can later be extended to a persistence layer such as MongoDB.

This structure allows the application to switch between different persistence layers (MongoDB, MySQL, or in-memory) without modifying the core business logic.
### CQRS
The application uses CQRS (Command Query Responsibility Segregation) pattern by the port `CommandQueryBus` to ensure scalability, maintainability, and performance.

Here is an example for a controller, where it calls `LoginCommand` and the `CommandQueryBus` calls `LoginHandler` that knows the business logic and returns the data

```ts
@Controller()
export class AuthController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus
  ) { }

  @Post('/login')
  @Public()
  async login(@Body(LoginSchema) request: LoginDto): Promise<AuthenticationDto> {    
    return this.commandQueryBus.send<LoginCommand, AuthenticationDto>(
      new LoginCommand(
        request.email,
        request.password
      )
    );
  }
}
```

In this example the `LoginHandler` needs to get the user information by email, the `LoginHandler` is from `AuthModule` and who knows the user information is the `UserModule`. To separate responsibilities the 
- `AuthModule` should be make tasks for authentication like compare passwords and generate JWT authentication token
- `UserModule` should be manage user information

Then via `CommandQueryBus` the `LoginHandler` calls the `GetUserByEmailQuery` to get the user information from the `UserModule` and then continue with the business logic and the `CommandQueryBus` controls the communication to the respective modules.

```ts
@CommandQuery(LoginCommand)
export class LoginHandler implements IRequestHandler<LoginCommand, AuthenticationDto> {
  constructor(
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly passwordEncryption: PasswordEncryption,
    private readonly commandQueryBus: CommandQueryBus
  ) { }

  async handle({ email, password }: LoginCommand): Promise<AuthenticationDto> {
    const user = await this.commandQueryBus.send<GetUserByEmailQuery, UserWithPasswordDto>(
      new GetUserByEmailQuery(
        email
      )
    );

    if (!user || !this.passwordEncryption.compare(password, user.password)) {
      throw new UserNotExistOrInvalidCredentialsException();
    }

    const { password: _, ...data } = user;

    return this.tokenGeneratorService.generate(data);
  }
}
```

### Cache
I've proposed a port for `Cache` to improve request times. For example it is used by controllers.
```ts
@Controller('statuses')
export class StatusController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus
  ) { }

  @Get('/')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  async getAll(): Promise<StatusDto[]> {    
    return this.commandQueryBus.send<GetAllStatusesQuery, StatusDto[]>(
      new GetAllStatusesQuery()
    );
  }
}
```
But the `Cache` adapter is injected at `CacheInterceptor` and this uses its methods to `set` and `get` cache items. Allowing to implement robust adapters like: `RedisCache` when the application scales.

### Another features
- `Logger`: Created to store logs
- `Mapper`: In charge of map domain entities to data transfer objects. This is implemented to ensure the separation of the responsibilities, in this case to map the communication data between layers, like `domain` to `application`.

---

## Project Structure

The backend is organized into modules, each following the Hexagonal Architecture pattern. Below is an overview of the main directories:

### Core
- **Domain**:
  - Contains entities, value objects, domain events, and exceptions.
  - Example: `invoice.entity.ts`, `product-not-found.exception.ts`.
- **Application**:
  - Defines use cases (commands and queries) and DTOs (Data Transfer Objects).
  - Example: `create-invoice.command.ts`, `get-all-products.query.ts`.

### Infrastructure
- **Persistence**:
  - Adapters for different databases (MongoDB, MySQL, in-memory).
  - Example: `mongo-db-invoice.repository.ts`, `mysql-product.repository.ts`.
- **Controllers**:
  - Handles HTTP requests and responses.
  - Example: `auth.controller.ts`, `product.controller.ts`.
- **Services**:
  - Implements external services like authentication, logging, and event publishing.
  - Example: `token-generator.service.ts`, `bcrypt-password-encryption.adapter.ts`.

### Shared
- Contains reusable components like DTOs, ports, adapters, and utilities.
- Example: `password-encryption.port.ts`, `uuid-generator.util.ts`.

---

## Key Features
- **Modularity**: Each module (e.g., `auth`, `invoices`, `products`, `users`) is independent and follows the Hexagonal Architecture.
- **Flexibility**: Support for multiple persistence layers (MongoDB, MySQL, in-memory) allows the application to adapt to different use cases.
- **Testability**: The separation of concerns makes it easy to write unit tests and integration tests for the core business logic.
- **Scalability**: The use of domain events and clean architecture ensures the application can scale as needed.


## Deployment
This repository contains a `docker-compose.yml` file to deploy easily the application. You should run `docker compose build --build-arg BASE_API_URL=http://localhost:3000/api/`

Where ARG: `BASE_API_URL` is the api url that the front will consume. It depends by the ip or by localhost is: `http://localhost:3000/api/`

Also you need the next .env files:

- `.env.backend`: Environment variables for backend
- `.env.mongodb`: Environment variables for mongo

There are example files at the repository.