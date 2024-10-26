import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  currentTab: 'login' | 'signup' = 'login';

  loginData = {
    email: '',
    password: ''
  };

  signupData = {
    fullName: '',
    email: '',
    password: ''
  };

  switchTab(tab: 'login' | 'signup') {
    this.currentTab = tab;
  }

  onLogin() {
    // Handle login submission
    console.log('Logging in:', this.loginData);
  }

  onSignup() {
    // Handle signup submission
    console.log('Signing up:', this.signupData);
  }
}
