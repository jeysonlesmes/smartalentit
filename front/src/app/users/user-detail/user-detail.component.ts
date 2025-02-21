import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../auth/services/auth.service';
import { AnalyticsComponent } from '../../invoices/analytics/analytics.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [SharedModule, RouterModule, UserFormComponent, UserInfoComponent, AnalyticsComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  editing: boolean = false;
  showAnalytics: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly messageService: NzMessageService,
    public readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadUser(params.get('id')!);
    });
  }

  edit(): void {
    this.editing = true;
  }

  cancelEdition(): void {
    this.editing = false;
  }

  onEditChange(user: User): void {
    this.user = user;
    this.cancelEdition();
  }

  delete(id: string): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.messageService.info(`User ${this.user!.name} deleted!`);
      this.router.navigate(['/users']);
    });
  }

  analytics(): void {
    this.showAnalytics = true;
  }

  closeAnalytics(): void {
    this.showAnalytics = false;
  }

  private loadUser(id: string): void {
    this.userService.getUserById(id).subscribe(user => {
      this.user = user;

      if (user === null) {
        this.messageService.error('User not found');
        this.router.navigate(['/users']);
      }
    });
  }
}
