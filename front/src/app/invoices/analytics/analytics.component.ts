import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { Summary } from '../interfaces/summary.interface';
import { User } from '../interfaces/user.interface';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnChanges {
  @Input() user: User | null = null;

  summary?: Summary;

  constructor(
    private readonly invoiceService: InvoiceService,
    public readonly authService: AuthService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.loadSummary();
    }
  }

  private loadSummary(): void {
    this.invoiceService.getSummary(this.user?.id!).subscribe(summary => {
      this.summary = summary;
    });
  }
}
