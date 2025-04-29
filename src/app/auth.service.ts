import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private tokenExpirationTimer: any;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _currentUser = new BehaviorSubject<any>(null);

  isLoggedIn$ = this._isLoggedIn.asObservable();
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.handleAuthentication(
            response.user.id,
            response.user.email,
            response.access_token,
            response.refresh_token,
            response.user
          );
        })
      );
  }

  updateApiKey(apiKey: string): Observable<any> {
    // Get the JWT token
    const token = this.getToken();
    
    if (!token) {
      console.error('No token available for API key update');
      return of({ error: 'No authentication token available' });
    }
    
    // Create headers with Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    console.log('Token being used:', token);
    console.log('Updating API key with URL:', `${this.apiUrl}/api-key`);
    
    // Make the request with explicit headers
    return this.http.put(
      `${this.apiUrl}/api-key`, 
      { api_key: apiKey }, 
      { headers: headers }
    ).pipe(
      tap(response => {
        console.log('API key update successful:', response);
        // Update the current user with the new API key status
        const currentUser = this._currentUser.getValue();
        if (currentUser) {
          currentUser.has_api_key = true;
          this._currentUser.next(currentUser);
          
          // Update local storage
          const userData = this.getStoredUserData();
          if (userData) {
            userData.user = currentUser;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      })
    );
  }

  refreshUserState(): void {
    const userData = this.getStoredUserData();
    if (userData && userData.user) {
      this._currentUser.next(userData.user);
    }
  }

  autoLogin(): void {
    const userData = this.getStoredUserData();
    if (!userData) {
      return;
    }

    if (userData.accessToken) {
      this._isLoggedIn.next(true);
      this._currentUser.next(userData.user);
      this.autoLogout(this.getTokenRemainingTime());
    }
  }

  logout(): void {
    localStorage.removeItem('userData');
    this._isLoggedIn.next(false);
    this._currentUser.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth']);
  }

  // Ensure this method exists and returns the isLoggedIn$ observable
  isAuthenticated(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  private handleAuthentication(
    userId: number,
    email: string,
    accessToken: string,
    refreshToken: string,
    user: any
  ): void {
    // Calculate expiration - assuming token is valid for 1 hour
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);

    const userData = {
      id: userId,
      email: email,
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenExpirationDate: expirationDate.toISOString(),
      user: user
    };

    // Ensure the localStorage is properly set before updating state
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update state after localStorage is set
    this._isLoggedIn.next(true);
    this._currentUser.next(user);
    
    console.log('Authentication state updated, isLoggedIn:', true);
    console.log('User data stored:', userData);
    
    this.autoLogout(3600 * 1000);
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private getStoredUserData(): any {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return null;
    }

    const parsedData = JSON.parse(userData);
    const expirationDate = new Date(parsedData.tokenExpirationDate);

    if (expirationDate <= new Date()) {
      localStorage.removeItem('userData');
      return null;
    }

    return parsedData;
  }

  private getTokenRemainingTime(): number {
    const userData = this.getStoredUserData();
    if (!userData) {
      return 0;
    }
    
    const expirationDate = new Date(userData.tokenExpirationDate);
    const now = new Date();
    const remainingTime = expirationDate.getTime() - now.getTime();
    
    return remainingTime > 0 ? remainingTime : 0;
  }

  getToken(): string | null {
    const userData = this.getStoredUserData();
    if (!userData || !userData.accessToken) {
      console.log('No valid token found in storage');
      return null;
    }
    console.log('Token retrieved from storage');
    return userData.accessToken;
  }

  getUserId(): number | null {
    const userData = this.getStoredUserData();
    return userData ? userData.id : null;
  }
}
