import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLoginMode = true;
  errorMessage = '';
  successMessage = '';
  
  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    api_key: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearMessages();
  }

  onSubmit(): void {
    this.clearMessages();
    
    if (this.isLoginMode) {
      this.onLogin();
    } else {
      this.onRegister();
    }
  }

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }
    
    console.log('Attempting login with email:', this.loginData.email);
    
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful, response:', response);
          setTimeout(() => {
            this.router.navigate(['/courses']);
          }, 100);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.error || 'An unexpected error occurred';
        }
      });
  }

  onRegister(): void {
    this.authService.register(this.registerData)
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please login.';
          this.isLoginMode = true;
          this.loginData.email = this.registerData.email;
          this.registerData = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            api_key: ''
          };
        },
        error: (error) => {
          this.errorMessage = error.error.error || 'An unexpected error occurred';
        }
      });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
