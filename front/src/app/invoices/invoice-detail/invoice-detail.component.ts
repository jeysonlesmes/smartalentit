import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../auth/services/auth.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { Invoice } from '../interfaces/invoice.interface';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent {
  invoice: Invoice | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly invoiceService: InvoiceService,
    private readonly router: Router,
    private readonly messageService: NzMessageService,
    public readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadInvoice(params.get('id')!);
    });
  }

  private loadInvoice(id: string): void {
    this.invoiceService.getInvoiceById(id).subscribe(invoice => {
      this.invoice = invoice;

      if (invoice === null) {
        this.messageService.error('Invoice not found');
        this.router.navigate(['/invoices']);
      }
    });
  }
}
