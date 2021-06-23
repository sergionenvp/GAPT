import { Component, OnInit } from '@angular/core';
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {AccountService} from '../account.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor(private accountService: AccountService, private router: Router) { }
  // Last snapshot taken
  webcamImage: WebcamImage = null;
  // Webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();
  check: number;
  // Location of the default picture in place where the snapshot should appear
  defaultImgUrl = '/assets/images/default.jpg';

  ngOnInit(): void {
    // Set the mode to registration / authorization / picture update
    this.check = this.accountService.check;
  }

  // Method to trigger the webcam to take a snapshot
  triggerSnapshot(): void {
    this.trigger.next();
  }
  // Method to show last snapshot in the preview window
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.defaultImgUrl = null;
  }

  // Trigger observable
  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  // Method called when the user saves the snapshot taken
  onSave(): void {
    // Snapshot was taken
    if (this.webcamImage) {
      // convertCapturedImage() method is called to convert the snapshot into a jpeg file
      const image = this.convertCapturedImage(this.webcamImage);
      // Registration mode
      if (this.check === 0) {
        // Picture is appended to FormData with user information that will be sent to register user account
        this.accountService.form.append('image', image, image.name);
        // registerUser() method is called, if successful, getToken() method is called to
        // to get the authentication token and create session cookie.
        // In case of error the user is informed and redirected to the Home screen
        this.accountService.registerUser().subscribe(
          () => {
            this.accountService.getToken();
          },
          () => {
            Swal.fire('Registration problem',
              'Something went wrong! Try again later',
              'error');
            this.router.navigate(['/']);
          });
        // Authentication method (still needs to be correctly connected to backend face recognition API)
      } else if (this.check === 1) {
        // the picture is sent to backend API for verification
        // this.accountService.matchPicture(data);
        // const picCorrect = get true/false response from server on picture identification ?
        //   if (picCorrect) {
        //   this.accountService.getToken();
        // } else {
        //   Swal.fire('Picture mismatch!', 'Uploaded picture does not match your original picture. Please, try again!', 'error');
        // }
        // Picture update mode
      } else if (this.check === 2) {
        // Picture is appended to a FormData object, then updateUserInfo() method is called to upload new user profile picture
        // The user is informed about the result of the operation and redirected back to profile
        const upload = new FormData();
        upload.append('image', image, image.name);
        this.accountService.updateUserInfo(upload).subscribe(
          () => {
            Swal.fire('Picture updated!',
              'Your profile picture is updated',
              'success');
          },
          () => {
            Swal.fire('Update problem',
              'Something went wrong! Your picture is not updated. Try again later',
              'error');
          }
        );
        this.router.navigate(['/profile']);
        // Operation mode is not set, signifying an error. Redirect to Home screen
      } else {
        Swal.fire('Camera error',
          'Something went wrong! Try again later',
          'error');
        this.router.navigate(['/']);
      }
    }
  }

  // Method to convert a base64 image to a jpeg file
  convertCapturedImage(data: WebcamImage): File {
    const arr = data.imageAsDataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const imageName = Guid.create().toString() + '.jpeg';
    const file = new Blob ([u8arr], {type: mime});
    return new File([file], imageName, { type: 'image/jpeg' });
  }

  // Event that informs the user if their browser is not allowed to access the camera
  // or there is another problem with the camera initialization
  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      Swal.fire('Camera access is blocked',
        'Please, allow camera access to take a picture. Otherwise you will not be able to proceed',
        'warning');
    } else {
      Swal.fire('Camera error',
        'Something went wrong! Try again later',
        'error');
      this.router.navigate(['/']);
    }
  }
}
