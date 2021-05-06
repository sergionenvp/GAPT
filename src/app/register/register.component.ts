import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Email} from './email.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  code;
  email;
  // @ViewChild('f') form: NgForm;
  // submitted = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void  {
    if (!form.valid){
      return;
    }
    // Sample code to send to backend for email generation
    this.code = Math.floor(Math.random() * 90000) + 10000;
    this.email = form.value.email;
    const payLoad: Email = {
      message: 'Your email verification code ' + this.code,
      subject: 'Verify your email',
      toEmail: this.email
    };

    // this.http.post('server_endpoint', payLoad).subscribe(() => this.router.navigate(['/auth']));
    this.router.navigate(['/auth']);
  }

}
