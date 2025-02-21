import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subscriber } from 'rxjs';
import { baseApiUrl, PATHS } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { Authentication } from '../interfaces/authentication.interface';
import { User } from '../../users/interfaces/user.interface';
import { Credentials } from '../interfaces/credentials.interface';
import { Login } from '../interfaces/login.interface';
import { SignUp } from '../interfaces/sign-up.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('session');
    return !!token;
  }

  user(): User | null {
    return this.session()?.user || null;
  }

  setUser(user: User): void {
    const authentication = this.session();

    if (!authentication) {
      return;
    }

    this.storageSession({
      ...authentication,
      user
    });
  }

  credentials(): Credentials | null {
    return this.session()?.token || null;
  }

  session(): Authentication | null {
    const session = localStorage.getItem('session');

    if (!session) {
      return null;
    }

    return JSON.parse(session);
  }

  isAdmin(): boolean {
    return this.session()?.user?.role?.code === 'admin';
  }

  login(credentials: Login): Observable<User> {
    return new Observable<User>(observer => {
      this.authenticate(credentials).subscribe(authentication => this.setSession(authentication, observer));
    });
  }

  signUp(request: SignUp): Observable<User> {
    return new Observable<User>(observer => {
      this.register(request).subscribe(authentication => this.setSession(authentication, observer));
    });
  }

  logout(): void {
    localStorage.removeItem('session');
    localStorage.removeItem('shopping-cart');
    this.router.navigate(['/auth/login']);
  }

  private authenticate(credentials: Login): Observable<Authentication> {
    const url = `${baseApiUrl}${PATHS.AUTH.URL}${PATHS.AUTH.LOGIN}`;

    return this.http.post<ApiResponse<Authentication>>(url, credentials).pipe(map(response => response.data!));
  }

  private register(request: SignUp): Observable<Authentication> {
    const url = `${baseApiUrl}${PATHS.AUTH.URL}${PATHS.AUTH.SIGN_UP}`;

    return this.http.post<ApiResponse<Authentication>>(url, request).pipe(map(response => response.data!));
  }

  private setSession(authentication: Authentication, observer: Subscriber<User>): void {
    this.storageSession(authentication);
    this.router.navigate(['/']);
    observer.next(authentication.user);
    observer.complete();
  }

  private storageSession(authentication: Authentication): void {
    localStorage.setItem('session', JSON.stringify(authentication));
  }
}