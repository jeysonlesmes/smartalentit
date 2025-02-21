import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { User } from '../interfaces/user.interface';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedModule, UserFormComponent, UserInfoComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  user: User;
  editing: boolean = false;

  constructor(
    private readonly authService: AuthService
  ) {
    this.user = authService.user()!;
  }

  edit(): void {
    this.editing = true;
  }

  cancelEdition(): void {
    this.editing = false;
  }

  onEditChange(user: User): void {
    this.user = user;
    this.authService.setUser(user);
    this.cancelEdition();
  }
}
