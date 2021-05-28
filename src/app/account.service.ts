import {Email} from './register/email.model';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

interface Response {
  success: string;
  message: string;
}

interface Token {
  auth_token: string;
}

@Injectable()
export class AccountService{

  code: number;
  emailSent = '';
  body;
  form: FormData;
  isLogged: boolean;
  check: number; // 0 is user registration, 1 is login with picture, 2 is changing profile picture
  baseUrl = 'http://127.0.0.1:8000/';
  emailUrl = this.baseUrl + 'accounts/email_view';
  registerUrl = this.baseUrl + 'auth/users/';
  loginUrl = this.baseUrl + 'auth/token/login/';
  logoutUrl = this.baseUrl + 'auth/token/logout/';
  userUrl = this.baseUrl + 'auth/users/me/';
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private router: Router,
              private http: HttpClient,
              private cookieService: CookieService){}

 getCode(payLoad: Email): boolean {
   this.http.post(this.emailUrl, payLoad).subscribe((response: Response) => {
     this.router.navigate(['/auth']); this.code = +response.message; }, (error: Response) => {
     this.emailSent = error.message;
     Swal.fire('Email not sent',
       'Something went wrong! Try again later',
       'error'); } );
   if (this.emailSent === 'error') {
     return false;
   }
   return true;
  }

 registerUser() {
    return this.http.post<any>(this.registerUrl, this.form);
 }

  authUser() {
    return this.http.post(this.loginUrl, this.body,
      {headers: this.headers});
  }

  loginUser(userData) {
    this.body = JSON.stringify(userData);
    return this.http.post(this.loginUrl, this.body,
      {headers: this.headers});
  }

  getAuthJsonHeaders() {
    const token = this.cookieService.get('pictureId');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    });
  }

  logoutUser() {
    return this.http.post(this.logoutUrl, null,
      {headers: this.getAuthJsonHeaders()});
  }

  getUserInfo() {
    return this.http.get(this.userUrl, {headers: this.getAuthJsonHeaders()});
  }

  updateUserInfo(userData) {
    return this.http.patch<any>(this.userUrl, userData,
      {headers: this.getAuthJsonHeaders().delete('Content-Type', 'application/json')});
  }

  deleteUser(userData) {
    const data = JSON.stringify(userData);
    return this.http.request('DELETE', this.userUrl,
      { body: data, headers: this.getAuthJsonHeaders()});
  }

  createCookie(token): void {
    this.cookieService.set('pictureId', token);
    this.router.navigate(['/profile']).then(() => {
      window.location.reload(); });
  }

  getToken(): void {
    this.authUser().subscribe(
      (result: Token) => {
        this.createCookie(result.auth_token);
      },
      () => {
        Swal.fire('Login problem',
          'Something went wrong! Try again later',
          'error');
        this.router.navigate(['/login']);
      }
    );
  }
}
