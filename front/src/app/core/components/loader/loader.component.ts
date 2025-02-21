import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading$ = this.loaderService.isLoading$;

  constructor(private readonly loaderService: LoaderService) {}
}
