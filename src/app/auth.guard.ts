import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      map((isAuthenticated: boolean) => {
        console.log('Auth Guard check, isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
          console.log('Not authenticated, redirecting to /auth');
          this.router.navigate(['/auth']);
          return false;
        }
        return true;
      }),
      tap(isAllowed => {
        if (isAllowed) {
          console.log('Navigation allowed to:', state.url);
        }
      })
    );
  }
}
