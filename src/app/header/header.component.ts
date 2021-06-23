import {Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';
import {BnNgIdleService} from 'bn-ng-idle';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private cookieService: CookieService,
              private accountService: AccountService,
              private bnIdle: BnNgIdleService,
              private router: Router) { }

  ngOnInit(): void {
    // Check if the user is already logged in
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.isLoggedIn = true;
    }
    // If the user is logged in, but is idle for 5 minutes,
    // the session will be automatically timed out and user will be logged out
    if (this.isLoggedIn) {
      this.bnIdle.startWatching(300).subscribe((res) => {
        if (res) {
          Swal.fire('Automatic logout',
            'You have been logged out due to inactivity',
            'warning');
          this.logOut();
        }
      });
    }
  }

  // Logout method that calls logoutUser() from AccountService to remove authentication token,
  // deletes the cookie and redirects to the Home screen
  logOut(): void {
    this.accountService.logoutUser().subscribe(
      () => {
        this.cookieService.delete('pictureId');
        this.isLoggedIn = false;
        this.router.navigate(['/']);
      }
    );
  }
}
