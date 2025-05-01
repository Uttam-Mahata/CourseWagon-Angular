import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    standalone: false
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
