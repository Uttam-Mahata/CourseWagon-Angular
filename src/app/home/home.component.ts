import { Component } from '@angular/core';
import { 
  faMagic, 
  faBrain, 
  faLaptopCode, 
  faChartLine, 
  faBookOpen, 
  faShoppingCart, 
  faLayerGroup, 
  faSitemap, 
  faUser, 
  faUserPlus 
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    standalone: false
})
export class HomeComponent { 
  // FontAwesome icons
  faMagic = faMagic;
  faBrain = faBrain;
  faLaptopCode = faLaptopCode;
  faChartLine = faChartLine;
  faBookOpen = faBookOpen;
  faShoppingCart = faShoppingCart;
  faLayerGroup = faLayerGroup;
  faSitemap = faSitemap;
  faUser = faUser;
  faUserPlus = faUserPlus;
}
