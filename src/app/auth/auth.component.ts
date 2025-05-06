import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faUser, faUserPlus, faSignInAlt, faKey, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    standalone: false
})
export class AuthComponent implements OnInit {
  // FontAwesome icons
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUser = faUser;
  faUserPlus = faUserPlus;
  faSignInAlt = faSignInAlt;
  faKey = faKey;
  faExclamationTriangle = faExclamationTriangle;
  faCheckCircle = faCheckCircle;
  
  isLoginMode = true;
  errorMessage = '';
  successMessage = '';
  
  loginData = {
    email: '',
    password: '',
    rememberMe: false  // Add remember me field
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
    private router: Router,
    private faLibrary: FaIconLibrary
  ) {
    faLibrary.addIcons(
      faEnvelope, faLock, faUser, faUserPlus, faSignInAlt, faKey, faExclamationTriangle, faCheckCircle
    );
  }

  ngOnInit(): void {
    // Check if user is already logged in
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log('User already logged in. Redirecting to courses page.');
        this.router.navigate(['/courses']);
      }
    });
  }

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
    
    console.log('Attempting login with email:', this.loginData.email, 'Remember me:', this.loginData.rememberMe);
    
    this.authService.login(
      this.loginData.email, 
      this.loginData.password, 
      this.loginData.rememberMe  // Pass the remember me value
    )
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
