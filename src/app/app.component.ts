import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { faBars, faTimes, faGraduationCap, faShoppingCart, faBook, faUser, faPowerOff, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'; // Import icons

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'CourseWagon';
  isAuthenticated = false;
  isNavbarOpen = false;

  // Assign icons to properties
  faBars = faBars;
  faTimes = faTimes;
  faGraduationCap = faGraduationCap;
  faShoppingCart = faShoppingCart;
  faBook = faBook;
  faUser = faUser;
  faPowerOff = faPowerOff;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Use isLoggedIn$ directly instead of isAuthenticated method
    this.authService.isLoggedIn$.subscribe(
      (isAuth: boolean) => {
        console.log('App component - authentication state changed:', isAuth);
        this.isAuthenticated = isAuth;
      }
    );
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
