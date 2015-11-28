export default class ErrorMessage {
  constructor(error: ErrorMessage) {
    this.title = error.title;
    this.message = error.message;
    this.status = error.status;
    this.stack = error.stack;
  }

  title: string;
  message: string;
  status: number;
  stack: string;
}
