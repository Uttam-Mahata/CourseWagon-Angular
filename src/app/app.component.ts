import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CourseWagon';
  isNavbarOpen = false;

  

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

}
