import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/modules/shared.module';
import { CreateInvoice } from '../interfaces/create-invoice.interface';
import { Product } from '../interfaces/shopping-cart.interface';
import { InvoiceService } from '../services/invoice.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss'
})
export class CreateInvoiceComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private readonly invoiceService: InvoiceService,
    public readonly shoppingCartService: ShoppingCartService,
    private readonly messageService: NzMessageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.setProducts();
  }

  add(product: Product): void {
    this.shoppingCartService.add(product);
    this.setProducts();
  }

  remove(product: Product): void {
    this.shoppingCartService.remove(product);
    this.setProducts();
  }

  delete(product: Product): void {
    this.shoppingCartService.delete(product);
    this.setProducts();
  }

  createInvoice(): void {
    const products = this.getProducts().map(({ id, quantity }) => ({ id, quantity }));
    const invoiceData: CreateInvoice = { products };

    this.invoiceService.createInvoice(invoiceData).subscribe(invoice => {
      this.messageService.success('Invoice created successfully!');
      this.router.navigate([`/invoices/${invoice.id}`]);
      this.shoppingCartService.clear();
    });
  }

  private getProducts(): Product[] {
    return Object.values(this.shoppingCartService.getProducts());
  }

  private setProducts(): void {
    this.products = this.getProducts();
  }
}
