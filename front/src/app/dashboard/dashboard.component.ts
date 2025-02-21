import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { SharedModule } from '../shared/modules/shared.module';
import { ShoppingCartService } from '../invoices/services/shopping-cart.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isCollapsed = false;

  constructor(
    private readonly authService: AuthService,
    private readonly shoppingCartService: ShoppingCartService
  ) { }

  get username(): string {
    return this.authService.user()?.name ?? '';
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get shoppingCartLabel(): string {
    const label = 'Shopping cart';
    const totalProducts = this.shoppingCartService.totalProducts();
    
    if (!totalProducts) {
      return label;
    }

    return `${label} (${totalProducts})`;
  }

  get shoppingCartProducts(): number {
    return this.shoppingCartService.totalProducts();
  }

  logout(): void {
    this.authService.logout();
  }
}
