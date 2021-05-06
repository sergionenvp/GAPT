import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editMode = false;
  settings = false;
  authMode;
  defaultImgUrl = '../assets/images/default.jpg';
  imageUrl = this.defaultImgUrl;
  mail = 'example@email.com';
  phone = '+35612345678';
  password = '123456';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if (!form.valid){
      return;
    }
    this.editMode = false;
  }

  onPicDelete(): void{
    this.imageUrl = this.defaultImgUrl;
  }

  onSaveSet(form: NgForm): void {
    if (!form.valid){
      return;
    }
    this.authMode = form.value.radio;
    // pass updated value to server
    this.settings = false;
  }
}
