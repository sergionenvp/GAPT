export class Sms{
  body: string;
  toNum: string;

  constructor(body: string, toNum: string) {
    this.body = body;
    this.toNum = toNum;
  }
}
