import { Component } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../interfaces/user.interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [SharedModule, UserFormComponent, RouterModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  constructor(
    private readonly router: Router
  ) {}

  onUserCreate(_user: User): void {
    this.router.navigate(['/users']);
  }
}
