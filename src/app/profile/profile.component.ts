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
  // Customization of the alert popups using Bootstrap
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
  imageUrl = this.defaultImgUrl; // reassigned to user picture url loaded from backend
  imageHash: string;
  mail = '';
  phone = '';

  constructor(private cookieService: CookieService,
              private router: Router,
              private accountService: AccountService) { }

  ngOnInit(): void {
    // Check if the user is not logged in and redirect to Login screen
    const token = this.cookieService.get('pictureId');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      // If logged in, get all user data from backend database
      this.accountService.getUserInfo().subscribe(
        (result: UserModel) => {
          this.mail = result.email;
          this.phone = result.phone;
          this.imageHash = result.image_hash;
          this.authMode = result.auth_mode;
          if (result.image) {
            this.imageUrl = result.image;
          }
          // If authentication is turned off, hide user picture and phone number
          if (this.authMode === '4') {
            this.imageUrl = this.defaultImgUrl;
            this.phone = 'hidden';
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

  // Method called when user wants to make changes to their profile
  onSubmit(form: NgForm): void {
    // Check if form is valid
    if (!form.valid){
      return;
    }
    // FormData object to hold the data provided by the user
    const upload = new FormData();
    if (form.value.phone !== '') {
      upload.append('phone', form.value.phone);
    }
    if (form.value.phone !== '') {
      upload.append('password', form.value.password);
    }
    // Call updateUserInfo method to pass new data to backend to be save in the database
    this.accountService.updateUserInfo(upload).subscribe(
      () => {
        Swal.fire('Update success', 'Your profile is updated', 'success');
        this.editMode = false;
        // Reload to show updated user info
        window.location.reload();
      },
      () => {
        Swal.fire('Update problem',
          'Something went wrong! Your profile is not updated. Try again later',
          'error');
      }
    );
  }

  // Method called when user picture is deleted from the profile
  onPicDelete(): void{
    // Alert window that asks the user if they really want to delete profile picture
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
        // Profile picture is et to default
        this.imageUrl = this.defaultImgUrl;
        // Empty value is passed in FormData to be stored in the database instead of the user picture
        const upload = new FormData();
        upload.append('image', '');
        // Call updateUserInfo method to save changes in the database
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

  // Method to change account authorization settings
  onSaveSet(form: NgForm): void {
    // Check if form is valid
    if (!form.valid){
      return;
    }
    // Check if user wants to set phone verification, but there is no phone number in the profile
    // Show a warning asking to select a different option or provide a phone number
    if (this.phone === '' && form.value.auth_mode === '3') {
      Swal.fire('Attention!',
        'Please, provide a phone number in your profile or select other authentication method',
        'warning');
      // Check if the user wants to set face verification and has no picture in the profile
      // Show a warning asking to select a different option or add a picture
    } else if (this.imageUrl === this.defaultImgUrl && form.value.auth_mode === '2') {
      Swal.fire('Attention!',
        'Please, provide a picture in your profile or select other authentication method',
        'warning');
    } else {
      // Construct FormData object with a new value for auth_mode
      const upload = new FormData();
      upload.append('auth_mode', form.value.auth_mode);
      // Update user information in the database
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

  // Method to delete user account
  onUserDelete(form: NgForm): void {
    // Alert popup asking the user is they really want to delete the account
    this.swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      // If delete is confirmed, deleteUser() method is called
      // Upon account deletion completion session cookie is also deleted
      // The user is redirected to Home screen
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
        // Delete cancelled
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.swalWithBootstrapButtons.fire(
          'Operation cancelled'
        );
      }
    });
  }

  // Method used to update user profile picture
  onChangePic(): void {
    this.accountService.check = 2;
    this.router.navigate(['/camera']);
  }
}
