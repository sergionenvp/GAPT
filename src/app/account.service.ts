import {Email} from './register/email.model';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import {Sms} from './login/sms.model';

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
  check: number; // 0 is registration mode, 1 is authentication with face picture, 2 is changing profile picture
  userId: string;
  // Endpoints to the backend
  baseUrl = 'http://127.0.0.1:8000/';
  emailUrl = this.baseUrl + 'accounts/email_view';
  smsUrl = this.baseUrl + 'accounts/sms_view';
  registerUrl = this.baseUrl + 'auth/users/';
  loginUrl = this.baseUrl + 'auth/token/login/';
  logoutUrl = this.baseUrl + 'auth/token/logout/';
  userUrl = this.baseUrl + 'auth/users/me/';
  uploadUrl = this.baseUrl + 'accounts/upload_view';
  faceRecUrl = this.baseUrl + 'accounts/first_eyes_auth';
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private router: Router,
              private http: HttpClient,
              private cookieService: CookieService){}

              // Method to send request to backend API responsible for email sending service
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

  getCodeSms(payLoad: Sms): void {
    this.http.post(this.smsUrl, payLoad).subscribe((response: Response) => {
      this.router.navigate(['/auth']); this.code = +response.message; }, () => {
      Swal.fire('SMS not sent',
        'Something went wrong! Try again later',
        'error'); } );
  }

  // Method to register user in the backend database
 registerUser() {
    return this.http.post<any>(this.registerUrl, this.form);
 }

 // Method to get authentication token
  authUser() {
    return this.http.post(this.loginUrl, this.body,
      {headers: this.headers});
  }

  // Login method
  loginUser(userData) {
    this.body = JSON.stringify(userData);
    return this.http.post(this.loginUrl, this.body,
      {headers: this.headers});
  }

  // Create headers with authentication token
  getAuthJsonHeaders() {
    const token = this.cookieService.get('pictureId');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    });
  }

  // Method that sends a request to backend to remove user authentication token
  logoutUser() {
    return this.http.post(this.logoutUrl, null,
      {headers: this.getAuthJsonHeaders()});
  }

  // Method to get user information from the backend database
  getUserInfo() {
    return this.http.get(this.userUrl, {headers: this.getAuthJsonHeaders()});
  }

  // Method to update user information in the backend database
  updateUserInfo(userData) {
    return this.http.patch<any>(this.userUrl, userData,
      {headers: this.getAuthJsonHeaders().delete('Content-Type', 'application/json')});
  }

  // Delete user account from the backend database
  deleteUser(userData) {
    const data = JSON.stringify(userData);
    return this.http.request('DELETE', this.userUrl,
      { body: data, headers: this.getAuthJsonHeaders()});
  }

  // Method to create a session cookie using authentication token received from backend
  createCookie(token): void {
    this.cookieService.set('pictureId', token);
    this.router.navigate(['/profile']).then(() => {
      window.location.reload(); });
  }

  // Method to authenticate user, get token and create a session cookie
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

  pictureUpload(userData) {
    return this.http.post(this.uploadUrl, userData).subscribe(() => {
      Swal.fire('Success',
        'Picture sent to server!',
        'success');
      }, () => {
      Swal.fire('Fail',
        'Picture not sent to server',
        'error');
    });
  }

  pictureMatch(userData) {
    const data = JSON.stringify(userData);
    return this.http.post(this.faceRecUrl, data, {headers: this.getAuthJsonHeaders()});
  }
}
