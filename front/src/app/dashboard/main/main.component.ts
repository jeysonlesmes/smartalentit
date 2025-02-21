import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { AnalyticsComponent } from '../../invoices/analytics/analytics.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { User } from '../../users/interfaces/user.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SharedModule, AnalyticsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  user?: User | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['products']);
      return;
    }

    this.user = this.authService.user()!;
  }
}
