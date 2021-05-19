import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

interface Token {
  auth_token: string;
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
  email: string;
  codeIncorrect = false;
  code: number;

  constructor(private router: Router,
              private accountService: AccountService,
              private cookieService: CookieService) {}

  ngOnInit(): void {
    this.code = this.accountService.passCode();
    console.log(this.code);
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    if (this.code === form.value.code) {
      this.accountService.authUser().subscribe(
        (result: Token) => {
          this.accountService.createCookie(result.auth_token);
          // this.cookieService.set('pictureId', result.auth_token);
          // this.router.navigate(['/profile']).then(() => {
          //   window.location.reload(); });
        },
        error => {
          Swal.fire('Login problem', 'Something went wrong! Try again later', 'error');
        }
      );
    } else {
      this.codeIncorrect = true;
      form.resetForm();
    }
  }
}
