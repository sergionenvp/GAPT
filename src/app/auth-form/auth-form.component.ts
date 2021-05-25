import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';

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
  count = 0;
  check: number;

  constructor(private router: Router,
              private accountService: AccountService) {}

  ngOnInit(): void {
    this.code = this.accountService.code;
    this.check = this.accountService.check;
    console.log(this.code);
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    if (this.code === form.value.code) {
      if (this.check === 0) {
        this.accountService.registerUser().subscribe(
          () => { this.getToken(); },
        (err) => {
          console.log(err);
          Swal.fire('Registration problem', 'Something went wrong! Try again later', 'error');
          this.router.navigate(['/']);
        });
      } else if (this.check === 1) {
        this.getToken();
      }
    } else {
      this.codeIncorrect = true;
      this.count += 1;
      if (this.count === 3) {
        this.count = 0;
        this.router.navigate(['/']);
      }
      form.resetForm();
    }
  }

  getToken(): void {
    this.accountService.authUser().subscribe(
      (result: Token) => {
        this.accountService.createCookie(result.auth_token);
      },
      () => {
        Swal.fire('Login problem', 'Something went wrong! Try again later', 'error');
        this.router.navigate(['/login']);
      }
    );
  }
}
