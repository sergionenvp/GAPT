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
  email;
  image: File;
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

    this.accountService.check = 0;
    this.accountService.body = form.value;
    // this.accountService.image = form.value.image;
    const upload = new FormData();
    upload.append('email', form.value.email);
    upload.append('phone', form.value.phone);
    upload.append('password', form.value.password);
    if (this.image) {
      upload.append('image', this.image, this.image.name);
    } else {
      upload.append('image', form.value.image);
    }
    // .log(form.value.email);
    this.accountService.form = upload;
    this.email = form.value.email;
    const payLoad: Email = {
          message: 'Your email verification code ',
          subject: 'Verify your email',
          toEmail: this.email
        };
    this.emailSent = this.accountService.getCode(payLoad);
  }

  getFiles(event: any) {
    this.image = event.target.files[0];
  }
}
