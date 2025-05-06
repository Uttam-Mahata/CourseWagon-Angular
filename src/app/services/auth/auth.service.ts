import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.authApiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  
  // Observable sources
  private currentUserSource = new BehaviorSubject<any>(null);
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  
  // Observable streams
  currentUser$ = this.currentUserSource.asObservable();
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthState();
  }

  checkAuthState(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (token && user) {
      this.currentUserSource.next(user);
      this.isLoggedInSource.next(true);
      
      // Log the current authentication state for debugging
      console.log('Auth state checked - User is logged in', {token: token.substring(0, 10) + '...', user});
    } else {
      // Clear everything if either token or user is missing
      this.clearAuthData();
      console.log('Auth state checked - User is not logged in');
    }
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<any> {
    console.log(`Attempting to login with ${email}, remember me: ${rememberMe}`);
    return this.http.post(`${this.authUrl}/login`, { 
      email, 
      password,
      remember_me: rememberMe 
    }).pipe(
      tap((response: any) => {
        console.log('Login successful, storing auth data', response);
        this.storeAuthData(response.access_token, response.user);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData);
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth']);
  }

  getApiKey(): Observable<any> {
    return this.http.get(`${this.authUrl}/get-api-key`);
  }

  updateApiKey(apiKey: string): Observable<any> {
    console.log(`Updating API key, current token: ${this.getToken()?.substring(0, 10)}...`);
    return this.http.post(`${this.authUrl}/update-api-key`, { api_key: apiKey });
  }

  deleteApiKey(): Observable<any> {
    return this.http.delete(`${this.authUrl}/delete-api-key`);
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  storeAuthData(token: string, user: any): void {
    console.log(`Storing auth data - token: ${token.substring(0, 10)}...`);
    localStorage.setItem(this.tokenKey, token);
    this.storeUser(user);
  }
  
  // Password reset methods
  forgotPassword(email: string): Observable<any> {
    // Get current frontend URL to send in request for proper redirect
    const frontendUrl = window.location.origin;
    return this.http.post(`${this.authUrl}/forgot-password`, { 
      email, 
      frontend_url: frontendUrl 
    });
  }
  
  verifyResetToken(token: string): Observable<any> {
    return this.http.post(`${this.authUrl}/verify-reset-token`, { token });
  }
  
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, { token, password });
  }
  
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.authUrl}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  private storeUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSource.next(user);
    this.isLoggedInSource.next(true);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSource.next(null);
    this.isLoggedInSource.next(false);
  }
}
