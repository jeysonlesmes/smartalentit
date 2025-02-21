import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { SharedModule } from '../../shared/modules/shared.module';
import { getRoleName } from '../../shared/utils/role.utils';
import { Role } from '../interfaces/role.interface';
import { UserFilters } from '../interfaces/user-filters.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public users: PaginatedResult<User> = {} as PaginatedResult<User>;
  public defaultPageIndex: number = 1;
  public defaultPageSize: number = 10;
  public tableInitialized: boolean = false;
  public filters: UserFilters = {} as UserFilters;
  public roles: Role[] = [];

  getRoleName = getRoleName;

  private requestSubscriber: Subscription | null = null;

  constructor(
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.filters = {
      pageSize: this.defaultPageSize,
      pageIndex: this.defaultPageIndex
    };

    this.loadData();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (!this.tableInitialized) {
      this.tableInitialized = true;
      return;
    }

    this.filters.pageIndex = params.pageIndex || this.defaultPageIndex;
    this.filters.pageSize = params.pageSize || this.defaultPageSize;

    if (this.requestSubscriber) {
      this.requestSubscriber.unsubscribe();
    }

    this.loadUsers();
  }

  clearFilters(): void {
    this.filters.name = undefined;
    this.filters.email = undefined;
    this.filters.roles = undefined;

    this.loadUsers(true);
  }

  loadUsers(resetPagination: boolean = false) {
    if (resetPagination) {
      this.filters.pageIndex = this.defaultPageIndex;
    }

    this.requestSubscriber = this.userService.getUsers(this.filters).subscribe({
      next: (response: PaginatedResult<User>) => {
        this.users = response;
        this.requestSubscriber = null;
      },
      error: (error: HttpErrorResponse) => {
        this.requestSubscriber = null;
        console.error(error);
      }
    });
  }

  private loadData() {
    this.userService.getRoles().subscribe(roles => {
      this.roles = roles;
    });

    this.loadUsers();
  }
}
