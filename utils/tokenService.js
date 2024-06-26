const exceptions = require("./exceptions");
const jwt = require("jsonwebtoken");


exports.getOtpToken = (otp) => {
    try{
      return jwt.sign({otp}, process.env.JWT_SECRET, {
        expiresIn: '5m'
      });
    } catch (error) {
    console.error(error);
      throw new exceptions.TokenException("Error while generating OTP");
    }
};

exports.getTempUserIntoToken = (email) => {
    try{
      return jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '60m'
      });
    } catch (error) {
      console.error(error);
      throw new exceptions.TokenException("Error while generating OTP");
    }
}

exports.verifyUserTempToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error(error);
      throw new exceptions.TokenException("Error while verifying token");
    }
}

exports.verifyOtpToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error(error);
      throw new exceptions.TokenException("Error while verifying OTP token");
    }
}

exports.getAuthToken = (userId) => {
    try {
      return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '3d'
      });
    } catch (error) {
      console.error(error);
      throw new exceptions.TokenException("Error while generating auth token");
    }
}