import { CreateInvoiceHandler } from "@invoices/application/use-cases/create-invoice/create-invoice.handler";
import { GetAllInvoicesHandler } from "@invoices/application/use-cases/get-all-invoices/get-all-invoices.handler";
import { GetInvoiceByIdHandler } from "@invoices/application/use-cases/get-invoice-by-id/get-invoice-by-id.handler";
import { GetSummaryInvoicesHandler } from "@invoices/application/use-cases/get-summary-invoices/get-summary-invoices.handler";
import { InfrastructureModule } from "@invoices/infrastructure/infrastructure.module";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
  imports: [
    InfrastructureModule,
    RouterModule.register([
      {
        path: 'invoices',
        module: InfrastructureModule
      }
    ])
  ],
  providers: [
    CreateInvoiceHandler,
    GetInvoiceByIdHandler,
    GetSummaryInvoicesHandler,
    GetAllInvoicesHandler
  ]
})
export class InvoiceModule { }