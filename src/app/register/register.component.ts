import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Email} from './email.model';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  email;
  emailSent = true;
  isRegistered = false;

  constructor(private accountService: AccountService,
              private cookieService: CookieService,
              private router: Router) {}

  ngOnInit(): void {
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit(form: NgForm): void  {
    if (!form.valid){
      return;
    }

    this.accountService.registerUser(form.value).subscribe(
      () => {
        // Data to send to backend for email generation
        this.email = form.value.email;
        const payLoad: Email = {
          message: 'Your email verification code ',
          subject: 'Verify your email',
          toEmail: this.email
        };
        this.emailSent = this.accountService.getCode(payLoad);
      },
      error => {
          Swal.fire('Registration problem', 'Something went wrong! Try again later', 'error');
      }
    );
  }
}
