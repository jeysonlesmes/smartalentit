import { Injectable } from '@angular/core';
import { Product as BaseProduct } from '../../products/interfaces/product.interface';
import { Product, ShoppingCart } from '../interfaces/shopping-cart.interface';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(
    private readonly messageService: NzMessageService
  ) { }

  add(baseProduct: BaseProduct): void {
    const products = this.getProducts();

    const quantity = products[baseProduct.id]?.quantity ?? 0;

    if (quantity >= baseProduct.stock) {
      this.messageService.error(`Product ${baseProduct.name} does not have enough stock!`);
      return;
    }

    products[baseProduct.id] = {
      ...baseProduct,
      quantity: quantity + 1
    };

    localStorage.setItem('shopping-cart', JSON.stringify({ products }));

    this.messageService.success(`1 item of product ${baseProduct.name} was added to the shopping cart`);
  }

  remove(baseProduct: BaseProduct): void {
    const products = this.getProducts();

    const quantity = products[baseProduct.id]?.quantity ?? 0;

    if (quantity <= 1) {
      delete products[baseProduct.id];
      this.messageService.success(`Product ${baseProduct.name} was removed from the shopping cart`);
    } else {
      products[baseProduct.id] = {
        ...baseProduct,
        quantity: quantity - 1
      };

      this.messageService.success(`1 item of product ${baseProduct.name} was removed from the shopping cart`);
    }

    localStorage.setItem('shopping-cart', JSON.stringify({ products }));
  }

  delete(baseProduct: BaseProduct): void {
    const products = this.getProducts();
    delete products[baseProduct.id];

    this.messageService.success(`Product ${baseProduct.name} was removed from the shopping cart`);

    localStorage.setItem('shopping-cart', JSON.stringify({ products }));
  }

  getProduct(id: string): Product | null {
    const products = this.getProducts();

    return products[id] ?? null;
  }

  getProducts(): Record<string, Product> {
    const shoppingCart = this.get();

    if (!shoppingCart) {
      return {};
    }

    return shoppingCart.products;
  }

  totalProducts(): number {
    return Object.values(this.getProducts()).length;
  }

  total(): number {
    return Object.values(this.getProducts()).reduce((prevValue, product) => prevValue + (product.quantity * product.price), 0);
  }

  get(): ShoppingCart | null {
    const value = localStorage.getItem('shopping-cart');

    if (!value) {
      return null;
    }

    return JSON.parse(value) as ShoppingCart;
  }

  empty(): void {
    this.clear();
    this.messageService.success('Shopping cart was emptied successfully');
  }

  clear(): void {
    localStorage.removeItem('shopping-cart');
  }
}
