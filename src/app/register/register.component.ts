import {Component, OnInit } from '@angular/core';
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
  emailSent = true;

  constructor(private accountService: AccountService,
              private cookieService: CookieService,
              private router: Router) {}

  ngOnInit(): void {
    // Check if the user is logged in and redirect to profile
    const token = this.cookieService.get('pictureId');
    if (token) {
      this.router.navigate(['/profile']);
    }
  }

  // Method called upon form submission
  onSubmit(form: NgForm): void  {
    // Check if the form is valid
    if (!form.valid){
      return;
    }
    // Registration mode
    this.accountService.check = 0;
    // Form values
    this.accountService.body = form.value;
    // FormData object with user-provided data is generated
    const upload = new FormData();
    upload.append('email', form.value.email);
    upload.append('phone', form.value.phone);
    upload.append('password', form.value.password);
    this.accountService.form = upload;
    // Email object is instantiated with all the required fields that will be passed to backend
    const payLoad: Email = {
          message: 'Your email verification code ',
          subject: 'Verify your email',
          toEmail: form.value.email
        };
    // Method getCode() passes the Email object to AccountService to send request for email generation to backend
    this.emailSent = this.accountService.getCode(payLoad);
  }
}
