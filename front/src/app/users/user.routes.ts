import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { CreateUserComponent } from './create-user/create-user.component';

export const USER_ROUTES: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create', component: CreateUserComponent },
  { path: ':id', component: UserDetailComponent }
];