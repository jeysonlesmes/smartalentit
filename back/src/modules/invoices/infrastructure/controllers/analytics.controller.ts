import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { GetSummaryInvoicesQuery } from "@invoices/application/use-cases/get-summary-invoices/get-summary-invoices.query";
import { Controller, ForbiddenException, Get, Query } from "@nestjs/common";
import { UserDto } from "@shared/application/dtos/user.dto";
import { CommandQueryBus } from "@shared/application/ports/inbound/command-query-bus.port";
import { AuthUser } from "@shared/infrastructure/decorators/auth-user.decorator";

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus
  ) { }

  @Get('purchases/last-month')
  purchasesLastMonthByUserId(
    @Query('userId') userId: string,
    @AuthUser() authUser: UserDto
  ): Promise<InvoiceDto> {
    if (authUser.role.code !== "admin" && authUser.id !== userId) {
      throw new ForbiddenException("User can't get other users analytics");
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return this.commandQueryBus.send(
      new GetSummaryInvoicesQuery(
        userId,
        startDate,
        endDate
      )
    );
  }
}