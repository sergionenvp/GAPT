import {Email} from './register/email.model';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Response {
  success: string;
  message: string;
}

@Injectable()
export class AccountService{

  code: number;
  emailSent = '';
  body;
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
     this.router.navigate(['/auth']); this.code = +response.message; }, (error: Response) => { this.emailSent = error.message; } );
   if (this.emailSent === 'error') {
     return false;
   }
   return true;
  }

 passCode(): number{
   return this.code;
 }

 registerUser(userData) {
    this.body = JSON.stringify(userData);
    return this.http.post(this.registerUrl, this.body, {headers: this.headers});
 }

  authUser() {
    return this.http.post(this.loginUrl, this.body, {headers: this.headers});
  }

  loginUser(userData) {
    this.body = JSON.stringify(userData);
    return this.http.post(this.loginUrl, this.body, {headers: this.headers});
  }

  getAuthHeaders() {
    const token = this.cookieService.get('pictureId');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    });
  }

  logoutUser() {
    return this.http.post(this.logoutUrl, null, {headers: this.getAuthHeaders()});
  }

  getUserInfo() {
    return this.http.get(this.userUrl, {headers: this.getAuthHeaders()});
  }

  updateUserInfo(userData) {
    const data = JSON.stringify(userData);
    return this.http.patch(this.userUrl, data, {headers: this.getAuthHeaders()});
  }

  createCookie(token): void {
    this.cookieService.set('pictureId', token);
    this.router.navigate(['/profile']).then(() => {
      window.location.reload(); });
  }
}
