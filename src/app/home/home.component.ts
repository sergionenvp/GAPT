import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.isLoggedIn = true;
    }
  }

}
