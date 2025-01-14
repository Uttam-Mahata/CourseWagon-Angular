import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  errorMessage = '';
  successMessage = '';
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
