import { Component, Input } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { Product } from '../interfaces/product.interface';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent {
  @Input() product?: Product;

  constructor(
    public readonly authService: AuthService
  ) {}
}
