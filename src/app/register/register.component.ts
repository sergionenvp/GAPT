import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Email} from './email.model';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  email;
  emailSent = true;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void  {
    if (!form.valid){
      return;
    }
    // Code to send to backend for email generation
    this.email = form.value.email;
    const payLoad: Email = {
      message: 'Your email verification code ',
      subject: 'Verify your email',
      toEmail: this.email
    };

    this.emailSent = this.accountService.getCode(payLoad);
    console.log(this.emailSent);
  }

}
