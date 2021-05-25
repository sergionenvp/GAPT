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
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.isLoggedIn = true;
    }
    if (this.isLoggedIn) {
      this.bnIdle.startWatching(300).subscribe((res) => {
        if (res) {
          Swal.fire('Automatic logout', 'You have been logged out due to inactivity', 'warning');
          this.logOut();
        }
      });
    }
  }

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
