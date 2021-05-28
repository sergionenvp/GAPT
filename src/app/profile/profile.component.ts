import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {AccountService} from '../account.service';
import Swal from 'sweetalert2';

interface UserModel {
  email: string;
  phone: string;
  image: string;
  image_hash: string;
  auth_mode: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });
  editMode = false;
  settings = false;
  imageChanged = false;
  deleteAccount = false;
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
          if (result.image) {
            this.imageUrl = result.image;
          }
          if (this.authMode === '4') {
            this.imageUrl = this.defaultImgUrl; // hides user picture if 2-factor authentication is off
          }
        },
        () => {
          Swal.fire('Connection problem',
            'Something went wrong! Not all information in the profile is accurate. Try again later',
            'error');
        }
      );
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid){
      return;
    }

    const upload = new FormData();
    if (form.value.email !== '') {
      upload.append('email', form.value.email);
    }
    if (form.value.phone !== '') {
      upload.append('phone', form.value.phone);
    }
    upload.append('password', form.value.password);

    this.accountService.updateUserInfo(upload).subscribe(
      () => {
        Swal.fire('Update success', 'Your profile is updated', 'success');
        this.editMode = false;
        window.location.reload();
      },
      () => {
        Swal.fire('Update problem',
          'Something went wrong! Your profile is not updated. Try again later',
          'error');
      }
    );
  }

  onPicDelete(): void{
    this.swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.imageUrl = this.defaultImgUrl;
        const upload = new FormData();
        upload.append('image', '');
        this.accountService.updateUserInfo(upload).subscribe(
          () => {
            this.swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your picture has been deleted.',
              'success'
            );
            this.editMode = false;
          },
          () => {
            Swal.fire('Delete problem',
              'Something went wrong! Your picture is not deleted. Try again later',
              'error');
          }
        );
      }
    });
  }

  onSaveSet(form: NgForm): void {
    if (!form.valid){
      return;
    }
    if (this.phone === '' && form.value.auth_mode === '3') {
      Swal.fire('Attention!',
        'Please, provide a phone number in your profile or select other authentication method',
        'warning');
    } else {
      const upload = new FormData();
      upload.append('auth_mode', form.value.auth_mode);
      this.accountService.updateUserInfo(upload).subscribe(
        () => {
          Swal.fire('Update success',
            'Your settings are updated',
            'success');
          this.settings = false;
        },
        () => {
          Swal.fire('Update problem',
            'Something went wrong! Your settings are not updated. Try again later',
            'error');
        }
      );
    }
  }

  onUserDelete(form: NgForm): void {
    this.swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.accountService.deleteUser(form.value).subscribe(
          () => {
            this.cookieService.delete('pictureId');
            this.swalWithBootstrapButtons.fire({
                showConfirmButton: false,
                icon: 'success',
                title: 'Deleted!',
                text: 'Your account has been deleted.'
            });
            this.router.navigate(['/']).then(() => window.location.reload());
          },
          () => {
            Swal.fire('Delete problem',
              'Something went wrong! Your account is not deleted. Try again later',
              'error');
          }
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.swalWithBootstrapButtons.fire(
          'Operation cancelled'
        );
      }
    });
  }

  onChangePic(): void {
    this.accountService.check = 2;
    this.router.navigate(['/camera']);
  }
}
