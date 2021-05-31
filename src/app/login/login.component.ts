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
  token: string;
  phone: string;
  // This property controls 2-factor authentication options: 1-email, 2-picture, 3-phone, 4-disabled
  authMode: string;

  constructor(private router: Router,
              private cookieService: CookieService,
              private accountService: AccountService,
              private http: HttpClient) { }

  ngOnInit(): void {
    // Check if the user is logged in and redirect to profile
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.router.navigate(['/profile']);
    }
  }

  // Method called upon form submission
  onSubmit(form: NgForm): void {
    // Check if the form is valid
    if (!form.valid){
      return;
    }
    // Authentication mode
    this.accountService.check = 1;
    // Get token to request user information form the backend
    this.accountService.loginUser(form.value).subscribe(
      (result: Token) => {
        this.token = result.auth_token;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + this.token
        });
        // Request authorization option selected by the user (stored in auth_mode attribute) using GET
        this.http.get('http://127.0.0.1:8000/auth/users/me/', {headers}).subscribe(
          (res: AuthMode) => {
            this.authMode = res.auth_mode;
            // Authentication is disabled by the user
            if (this.authMode === '4') {
              // Session cookie is created with the authentication token
              this.accountService.createCookie(this.token);
              // Authentication mode is set to email
            } else if (this.authMode === '1'){
              // Email object is instantiated with all the required fields that will be passed to backend
              const payLoad: Email = {
                message: 'Your email verification code ',
                subject: 'Verify your email',
                toEmail: form.value.email
              };
              // Method getCode() passes the Email object to AccountService to send request for email generation to backend
              this.accountService.getCode(payLoad);
              // Authentication mode is set to face recognition
            } else if (this.authMode === '2') {
              // Redirect to CameraComponent
              this.router.navigate(['/camera']);
              // Authentication mode is set to phone
            } else if (this.authMode === '3'){
              // Get user phone number
              this.phone = res.phone;
              // call method send code to phone
            }
          },
          () => {
            Swal.fire('Connection problem',
              'Something went wrong! Try again later',
              'error');
          }
        );
      },
      () => {
        Swal.fire('Login problem',
          'Unable to login with provided credentials',
          'error');
      }
    );
  }
}
