import {Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';
import {BnNgIdleService} from 'bn-ng-idle';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private cookieService: CookieService,
              private accountService: AccountService,
              private bnIdle: BnNgIdleService) { }

  ngOnInit(): void {
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.isLoggedIn = true;
      if (this.isLoggedIn) {
        this.bnIdle.startWatching(300).subscribe((res) => {
          if (res) {
            this.logOut();
            Swal.fire('Automatic logout', 'You have been logged out due to inactivity', 'warning');
          }
        });
      }
    }
  }

  logOut(): void {
    this.accountService.logoutUser().subscribe(
      () => {
        this.cookieService.delete('pictureId');
        this.isLoggedIn = false;
      },
      () => Swal.fire('Logout problem', 'Something went wrong! Try again later', 'error')
    );
  }
}
