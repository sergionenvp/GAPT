import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import {AccountService} from '../account.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Email} from '../register/email.model';

interface Token {
  auth_token: string;
}

interface AuthMode {
  auth_mode: string;
  phone: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  picCorrect = false;
  requestImg = false;
  image: File;
  token: string;
  phone: string;
  authMode: string; // this property controls 2-factor authentication: 1-email, 2-picture, 3-phone, 4-disabled

  constructor(private router: Router,
              private cookieService: CookieService,
              private accountService: AccountService,
              private http: HttpClient) { }

  ngOnInit(): void {
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid){
      return;
    }

    this.accountService.check = 1;
    this.accountService.loginUser(form.value).subscribe(
      (result: Token) => {
        this.token = result.auth_token;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + this.token
        });
        this.http.get('http://127.0.0.1:8000/auth/users/me/', {headers}).subscribe(
          (res: AuthMode) => {
            this.authMode = res.auth_mode;
            if (this.authMode === '4') {
              this.accountService.createCookie(this.token);
            } else if (this.authMode === '1'){
              const payLoad: Email = {
                message: 'Your email verification code ',
                subject: 'Verify your email',
                toEmail: form.value.email
              };
              this.accountService.getCode(payLoad);
            } else if (this.authMode === '2') {
              this.requestImg = true;
            } else if (this.authMode === '3'){
              this.phone = res.phone;
              // do smth to send code to phone ???
            }
          },
          () => {
            Swal.fire('Connection problem', 'Something went wrong! Try again later', 'error');
          }
        );
      },
      () => {
        Swal.fire('Login problem', 'Unable to login with provided credentials', 'error');
      }
    );
  }

  onImgSubmit(form: NgForm): void {
    // calculate new image hash and sent to server to compare with the original picture ?
    // this.picCorrect = get true/false response from server on picture identification ?
    if (this.picCorrect) {
      this.accountService.createCookie(this.token);
    } else {
      Swal.fire('Picture mismatch!', 'Uploaded picture does not match your original picture. Please, try again!', 'error');
      form.resetForm();
    }
  }

  getFiles(event: any) {
    this.image = event.target.files[0];
  }
}
