import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BnNgIdleService } from 'bn-ng-idle';
import { CameraComponent } from './camera/camera.component';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    AppComponent,
    AuthFormComponent,
    HeaderComponent,
    HomeComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamModule
  ],
  providers: [CookieService, BnNgIdleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
