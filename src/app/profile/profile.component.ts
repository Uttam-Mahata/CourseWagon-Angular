import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { 
  faEnvelope, faKey, faCheckCircle, faTimesCircle, 
  faExclamationCircle, faTimes, faExternalLinkAlt 
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {
  // FontAwesome icons
  faEnvelope = faEnvelope;
  faKey = faKey;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;
  faExternalLinkAlt = faExternalLinkAlt;

  user: any = null;
  apiKey: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  token: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Store token for debugging
    this.token = this.authService.getToken();
    
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      console.log('Current user in profile:', user);
    });
    
    // Check if we have a valid token
    if (!this.token) {
      console.log('No token found, redirecting to login');
      this.errorMessage = 'You need to log in first';
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 2000);
    }
  }

  updateApiKey(): void {
    if (!this.apiKey || this.apiKey.trim() === '') {
      this.errorMessage = 'API key cannot be empty';
      return;
    }

    // Verify token availability again before making the request
    if (!this.authService.getToken()) {
      this.errorMessage = 'Your session has expired. Please log in again.';
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 2000);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    console.log('Updating API key with token:', this.authService.getToken());
    
    this.authService.updateApiKey(this.apiKey)
      .subscribe({
        next: (response) => {
          console.log('API key update response:', response);
          this.successMessage = 'API key updated successfully';
          this.apiKey = '';
          this.isLoading = false;
          
          // Force refresh of user data
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        error: (err) => {
          console.error('API key update error:', err);
          if (err.status === 401) {
            this.errorMessage = 'Your session has expired. Please log in again.';
            setTimeout(() => {
              this.authService.logout();
            }, 2000);
          } else {
            this.errorMessage = err.error?.error || 'Failed to update API key. Please try again.';
          }
          this.isLoading = false;
        }
      });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
