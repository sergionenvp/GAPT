export class User{
  email: string;
  imagePath: string;

  constructor(email: string, imagePath: string) {
    this.email = email;
    this.imagePath = imagePath;
  }
}
