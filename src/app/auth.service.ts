import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://coursewagon-backend.onrender.com/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isAuthenticatedSubject.next(!!localStorage.getItem('access_token'));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    // Clear all stored tokens and user data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Update authentication state
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to auth page
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Utility method to check if user is currently authenticated
  getCurrentAuthState(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
