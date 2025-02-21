import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { baseApiUrl, PATHS } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { objectToQueryParams } from '../../shared/utils/http.utils';
import { Role } from '../interfaces/role.interface';
import { CreateUser, UpdateUser } from '../interfaces/user-data.interface';
import { UserFilters } from '../interfaces/user-filters.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly http: HttpClient
  ) { }

  getUsers(filters: UserFilters): Observable<PaginatedResult<User>> {
    const params = objectToQueryParams(filters);
    const url = `${baseApiUrl}${PATHS.USER.URL}?${params}`;

    return this.http.get<ApiResponse<PaginatedResult<User>>>(url).pipe(map(response => response.data!));
  }

  getUserById(id: string): Observable<User | null> {
    const url = `${baseApiUrl}${PATHS.USER.URL}/${id}`;

    return this.http.get<ApiResponse<User | null>>(url).pipe(map(response => response.data!));
  }

  createUser(user: CreateUser): Observable<User> {
    const url = `${baseApiUrl}${PATHS.USER.URL}`;

    return this.http.post<ApiResponse<User>>(url, user).pipe(map(response => response.data!));
  }

  updateUser(user: UpdateUser): Observable<User> {
    const url = `${baseApiUrl}${PATHS.USER.URL}`;

    return this.http.put<ApiResponse<User>>(url, user).pipe(map(response => response.data!));
  }

  deleteUser(id: string): Observable<void> {
    const url = `${baseApiUrl}${PATHS.USER.URL}/${id}`;

    return this.http.delete<ApiResponse<User | null>>(url).pipe(map(() => void 0));
  }

  getRoles(): Observable<Role[]> {
    const url = `${baseApiUrl}${PATHS.USER.URL}${PATHS.USER.ROLE.URL}`;

    return this.http.get<ApiResponse<Role[]>>(url).pipe(map(response => response.data!));
  }
}
