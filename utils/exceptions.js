//error that will be thrown when registration input is not correct
class UserInputException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserInputException';
  }
}
  class UserExistsException extends Error {
    constructor(message) {
      super(message);
      this.name = 'UserExistsException';
    }
  }

  class SendgidException extends Error {
    constructor(message) {
      super(message);
      this.name = 'SendgidException';
    }
  }

  class TokenException extends Error {
    constructor(message) {
      super(message);
      this.name = 'TokenException';
    }
  }

  class OtpException extends Error {
    constructor(message) {
      super(message);
      this.name = 'OtpException';
    }
  }

  class DbException extends Error {
    constructor(message) {
      super(message);
      this.name = 'DbException';
    }
  }

  class UserNotFoundException extends Error {
    constructor(message) {
      super(message);
      this.name = 'UserNotFoundException';
    }
  }

  module.exports = { UserInputException, UserExistsException, SendgidException, TokenException, OtpException, DbException, UserNotFoundException };