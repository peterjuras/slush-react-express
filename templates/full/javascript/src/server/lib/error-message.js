'use strict';

class ErrorMessage {
  constructor(error) {
    this.title = error.title;
    this.message = error.message;
    this.status = error.status;
    this.stack = error.stack;
  }
}

module.exports = ErrorMessage;
