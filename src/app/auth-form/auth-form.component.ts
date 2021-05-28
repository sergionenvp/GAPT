import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
  email: string;
  codeIncorrect = false;
  code: number;
  count = 0;
  check: number;

  constructor(private router: Router,
              private accountService: AccountService) {}

  ngOnInit(): void {
    this.code = this.accountService.code;
    this.check = this.accountService.check;
    console.log(this.code);
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    if (this.code === form.value.code) {
      if (this.check === 0) {
        this.router.navigate(['/camera']);
      } else if (this.check === 1) {
        this.accountService.getToken();
      }
    } else {
      this.codeIncorrect = true;
      this.count += 1;
      if (this.count === 3) {
        this.count = 0;
        this.router.navigate(['/']);
      }
      form.resetForm();
    }
  }


}
