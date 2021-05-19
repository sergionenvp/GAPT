export class User{
  email: string;
  phone: string;
  password: string;
  image_hash: string;

  constructor(email: string, phone: string, password: string, imageHash: string) {
    this.email = email;
    this. phone = phone;
    this.password = password;
    this.image_hash = imageHash;
  }
}
