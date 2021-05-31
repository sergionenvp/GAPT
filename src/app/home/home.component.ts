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
    // Check if the user agent has the authorization token cookie,
    // if it does, the user has already logged in and can see the View Profile button
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.isLoggedIn = true;
    }
  }

}
