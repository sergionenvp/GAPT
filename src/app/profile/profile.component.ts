import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';
import {User} from '../user.model';

interface UserModel {
  email: string;
  phone: string;
  image_url: string;
  image_hash: string;
  auth_mode: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editMode = false;
  settings = false;
  imageChanged = false;
  authMode: string;
  defaultImgUrl = '/assets/images/default.jpg';
  imageUrl = this.defaultImgUrl; // should be reassigned to user picture url loaded from backend/cloud
  imageHash: string;
  mail = '';
  phone = '';

  constructor(private cookieService: CookieService,
              private router: Router,
              private accountService: AccountService) { }

  ngOnInit(): void {
    const token = this.cookieService.get('pictureId');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.accountService.getUserInfo().subscribe(
        (result: UserModel) => {
          this.mail = result.email;
          this.phone = result.phone;
          this.imageHash = result.image_hash;
          this.authMode = result.auth_mode;
          // this.imageUrl = result.image_url;
          if (this.authMode === '4') {
            this.imageUrl = this.defaultImgUrl; // hides user picture if 2-factor authentication is off
          }
        },
        () => {
          Swal.fire('Connection problem', 'Something went wrong! Not all information in the profile is accurate. Try again later', 'error');
        }
      );
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid){
      return;
    }
    // Check if the user uploaded new picture
    // if (this.imageChanged){
    //   this.imageHash = // here should be a method to calculate new picture hash upon receipt
    // }
    if (form.value.email !== '') {
      this.mail = form.value.email;
    }
    if (form.value.phone !== '') {
      this.phone = form.value.phone;
    }
    const payLoad: User = {
      email: this.mail,
      phone: this.phone,
      password: form.value.password,
      image_hash: this.imageHash
    };
    this.accountService.updateUserInfo(payLoad).subscribe(
      () => {
        Swal.fire('Update success', 'Your profile is updated', 'success');
        this.editMode = false;
      },
      () => {
        Swal.fire('Update problem', 'Something went wrong! Your profile is not updated. Try again later', 'error');
      }
    );
  }

  onPicDelete(): void{
    this.imageUrl = this.defaultImgUrl;
    // updateUserInfo() to delete image_hash and image_url
  }

  onSaveSet(form: NgForm): void {
    if (!form.valid){
      return;
    }
    if (this.phone === '' && form.value.auth_mode === '3') {
      Swal.fire('Attention!', 'Please, provide a phone number in your profile or select other authentication method', 'warning');
    } else {
      this.accountService.updateUserInfo(form.value).subscribe(
        () => {
          Swal.fire('Update success', 'Your settings are updated', 'success');
          this.settings = false;
        },
        () => {
          Swal.fire('Update problem', 'Something went wrong! Your settings are not updated. Try again later', 'error');
        }
      );
    }
  }
}
