import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/modules/shared.module';
import { Product } from '../interfaces/product.interface';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [SharedModule, ProductFormComponent, RouterModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  constructor(
    private readonly router: Router
  ) { }

  onProductCreate(_product: Product): void {
    this.router.navigate(['/products']);
  }
}
