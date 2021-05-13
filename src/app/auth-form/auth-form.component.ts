import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
  email: string;
  codeIncorrect = false;
  code: number;

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    this.code = this.accountService.passCode();
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    if (this.code === form.value.code) {
      // confirm user registration server-side
      this.router.navigate(['/profile']);
    } else {
      this.codeIncorrect = true;
      form.resetForm();
    }
  }
}
