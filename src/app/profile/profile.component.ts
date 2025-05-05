import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { 
  faEnvelope, faKey, faCheckCircle, faTimesCircle, 
  faExclamationCircle, faTimes, faExternalLinkAlt,
  faEye, faEyeSlash, faTrash
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
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faTrash = faTrash;

  user: any = null;
  apiKey: string = '';
  currentApiKey: string = '';
  showApiKey: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: {[key: string]: boolean} = {
    apiKeyGet: false,
    apiKeyUpdate: false,
    apiKeyDelete: false
  };
  token: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Store token for debugging
    this.token = this.authService.getToken();
    console.log('Profile component initialized, token:', this.token?.substring(0, 10) + '...');
    
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      console.log('Current user in profile:', user);
      
      // If user has API key, fetch it
      if (user?.has_api_key) {
        this.fetchApiKey();
      }
    });
    
    // Check if we have a valid token and immediately try to fetch current user
    if (!this.token) {
      console.log('No token found, redirecting to login');
      this.errorMessage = 'You need to log in first';
      setTimeout(() => {
        this.router.navigate(['/auth']);
      }, 2000);
    } else {
      // Get the current user
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.has_api_key) {
        this.user = currentUser;
        this.fetchApiKey();
      }
    }
  }

  fetchApiKey(): void {
    console.log('Fetching API key...');
    this.isLoading['apiKeyGet'] = true;
    this.authService.getApiKey().subscribe({
      next: (response) => {
        console.log('API key fetched successfully:', response);
        this.currentApiKey = response.api_key;
        this.isLoading['apiKeyGet'] = false;
      },
      error: (err) => {
        console.error('Failed to retrieve API key:', err);
        this.isLoading['apiKeyGet'] = false;
        if (err.status === 404) {
          // This means the user doesn't have an API key yet
          this.currentApiKey = '';
        }
      }
    });
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

    this.isLoading['apiKeyUpdate'] = true;
    this.clearMessages();

    console.log('Updating API key with token:', this.authService.getToken()?.substring(0, 10) + '...');
    
    this.authService.updateApiKey(this.apiKey)
      .subscribe({
        next: (response) => {
          console.log('API key update response:', response);
          this.successMessage = 'API key updated successfully';
          this.apiKey = '';
          this.isLoading['apiKeyUpdate'] = false;
          
          // Update the stored user data with the updated user info
          if (response && response.user) {
            this.authService.storeAuthData(this.authService.getToken()!, response.user);
            this.user = response.user;
            
            // Fetch the new API key
            this.fetchApiKey();
          }
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
          this.isLoading['apiKeyUpdate'] = false;
        }
      });
  }

  deleteApiKey(): void {
    if (confirm('Are you sure you want to delete your API key? This will disable content generation functionality.')) {
      this.isLoading['apiKeyDelete'] = true;
      this.clearMessages();
      
      this.authService.deleteApiKey().subscribe({
        next: (response) => {
          this.successMessage = 'API key deleted successfully';
          this.currentApiKey = '';
          this.isLoading['apiKeyDelete'] = false;
          
          // Update the stored user data
          if (response && response.user) {
            this.authService.storeAuthData(this.authService.getToken()!, response.user);
            this.user = response.user;
          }
        },
        error: (err) => {
          console.error('API key deletion error:', err);
          this.errorMessage = err.error?.error || 'Failed to delete API key. Please try again.';
          this.isLoading['apiKeyDelete'] = false;
        }
      });
    }
  }

  toggleShowApiKey(): void {
    this.showApiKey = !this.showApiKey;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
