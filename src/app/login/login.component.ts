import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  picIncorrect = false;
  authMode = 1; // this property controls 2-factor authentication: 1-email, 2-phone, 3-disabled

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if (!form.valid){
      return;
    }
    // calculate image hash and send to server
    // this.picIncorrect = get response from server on picture identification
    if (!this.picIncorrect) {
      // authMode = get the value for this user
      // if (authMode === 1 || authMode === 2){
      // send e-mail with 2-factor auth
      this.router.navigate(['/auth']);
      //} else {
      // this.router.navigate(['/profile']);
      // }
    } else {
      form.resetForm();
    }
  }
}
