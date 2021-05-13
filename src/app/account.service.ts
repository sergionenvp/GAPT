import {Email} from './register/email.model';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

interface Response {
  success: string;
  message: string;
}

@Injectable()
export class AccountService{

  code: number;
  emailSent = '';

  constructor(private router: Router, private http: HttpClient){}

 getCode(payLoad: Email): boolean {
   this.http.post('http://127.0.0.1:8000/accounts/email_view', payLoad).subscribe((response: Response) => {
     this.router.navigate(['/auth']); this.code = +response.message; }, (error: Response) => { this.emailSent = error.message; } );
   if (this.emailSent === 'error') {
     return false;
   }
   return true;
  }

 passCode(): number{
   return this.code;
 }

}
