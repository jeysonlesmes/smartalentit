import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/modules/shared.module';
import { CreateProduct, UpdateProduct } from '../interfaces/product-data.interface';
import { Product } from '../interfaces/product.interface';
import { Status } from '../interfaces/status.interface';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Output() save: EventEmitter<Product> = new EventEmitter();

  validateForm: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    price: FormControl<number>;
    stock: FormControl<number>;
    status: FormControl<string>;
  }>;
  statuses: Status[] = [];

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly productService: ProductService,
    private readonly messageService: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required]],
      stock: [0, [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.updateFormState();
    }
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const productData = this.validateForm.value;

    if (this.product) {
      this.productService.updateProduct({ ...productData, id: this.product.id } as UpdateProduct).subscribe(product => {
        this.messageService.success('Product updated successfully!');
        this.save.emit(product);
      });
    } else {
      this.productService.createProduct(productData as CreateProduct).subscribe(product => {
        this.messageService.success('Product created successfully!');
        this.save.emit(product);
      });
    }
  }

  private updateFormState(): void {
    if (this.product) {
      this.validateForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        stock: this.product.stock,
        status: this.product.status.code
      });
    }
  }

  private loadData(): void {
    this.productService.getStatuses().subscribe(statuses => {
      this.statuses = statuses;
    })
  }
}
