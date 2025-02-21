import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../auth/services/auth.service';
import { ShoppingCartService } from '../../invoices/services/shopping-cart.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { Product } from '../interfaces/product.interface';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule, RouterModule, ProductFormComponent, ProductInfoComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  product: Product | null = null;
  editing: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly messageService: NzMessageService,
    public readonly authService: AuthService,
    public readonly shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadProduct(params.get('id')!);
    });
  }

  edit(): void {
    this.editing = true;
  }

  cancelEdition(): void {
    this.editing = false;
  }

  onEditChange(product: Product): void {
    this.product = product;
    this.cancelEdition();
  }

  delete(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.messageService.info(`Product ${this.product!.name} deleted!`);
      this.router.navigate(['/products']);
    });
  }

  goToShoppingCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  private loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;

      if (product === null) {
        this.messageService.error('Product not found');
        this.router.navigate(['/products']);
      }
    });
  }
}
