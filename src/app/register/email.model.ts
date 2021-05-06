export class Email{
  message: string;
  subject: string;
  toEmail: string;

  constructor(message: string, subject: string, toEmail: string) {
    this.message = message;
    this.subject = subject;
    this.toEmail = toEmail;
  }
}
