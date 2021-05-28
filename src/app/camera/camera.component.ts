import { Component, OnInit } from '@angular/core';
import {WebcamImage} from 'ngx-webcam';
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
  // latest snapshot
  webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();
  check: number;

  ngOnInit(): void {
    this.check = this.accountService.check;
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  onSave(): void {
    if (this.webcamImage) {
      const image = this.convertCapturedImage(this.webcamImage); // the resulting picture in a file
      console.log(image);
      if (this.check === 0) {
        this.accountService.form.append('image', image, image.name);
        this.accountService.registerUser().subscribe(
          () => { this.accountService.getToken(); },
          () => {
            Swal.fire('Registration problem',
              'Something went wrong! Try again later',
              'error');
            this.router.navigate(['/']);
          });
      } else if (this.check === 1) {
        // the picture is sent to backend API for verification
        // const picCorrect = get true/false response from server on picture identification ?
        //   if (picCorrect) {
        //   this.accountService.createCookie(this.token);
        // } else {
        //   Swal.fire('Picture mismatch!', 'Uploaded picture does not match your original picture. Please, try again!', 'error');
        // }
      } else if (this.check === 2) {
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
      }
    } else {
      Swal.fire('Camera error',
        'Something went wrong! Try again later',
        'error');
      this.router.navigate(['/']);
    }
  }

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
}
