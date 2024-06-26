const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const CryptoJS = require("crypto-js");
const tokenService = require("../utils/tokenService");
const exceptions = require("../utils/exceptions");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    await User.validateRegisterInput(full_name, email, password);

    const hashedPassword = bcrypt.hashSync(password, 10);
    const createdUser = await User.create({
      full_name: full_name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: "CLIENT",
    });

    //create the otp & stored an encrypted version of it in the db
    //then send the mail with the code
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpToken = tokenService.getOtpToken(otp);
    await User.storeOTP(createdUser.id, otpToken);
    // console.log("otpCode: ", otp);
    await sendEmail.sendConfirmationMail(createdUser.full_name, createdUser.email, otp);

    const userToken = tokenService.getTempUserIntoToken(createdUser.email);

    return res
      .status(201)
      .json({ message: "User created", user_token: userToken });
  } catch (error) {
    if (
      error.name === "UserInputException" ||
      error.name === "UserExistsException"
    ) {
      console.log("Error while registering the user", error);
      return res.status(400).json({ message: error.message });
    }
    console.log("Error while registering the user", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const { code, user_token } = req.body;

    const userEmail = tokenService.verifyUserTempToken(user_token);
    console.log("userEmail: ", userEmail);
    const user = await User.findByEmail(userEmail.email);
    const otpToken = await User.getOTP(user.id);

    const otp = tokenService.verifyOtpToken(otpToken).otp;

    if (otp != code) {
      console.log("Actual OTP: ", otp);
      throw new exceptions.OtpException("Invalid OTP");
    }

    const authToken = tokenService.getAuthToken(user.id);
    res.status(200).json({ message: "User verified", authToken });
  } catch (error) {
    if (error.name === "TokenException") {
      console.log("Error while verifying the user", error);
      return res.status(400).json({ message: error.message });
    }

    if (error.name === "OtpException") {
      console.log("Error while verifying the user", error);
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { user_token } = req.body;
    const userEmail = tokenService.verifyUserTempToken(user_token);
    const user = await User.findByEmail(userEmail.email);
    const newOtp = Math.floor(100000 + Math.random() * 900000);
    const newOtpToken = tokenService.getOtpToken(newOtp);
    await User.storeOTP(user.id, newOtpToken);
    // console.log("otpCode: ", newOtp);
    await sendEmail.sendConfirmationMail(user.full_name, user.email, newOtp);

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    if (error.name === "TokenException") {
      console.log("Error while resending the OTP", error);
      return res.status(400).json({ message: error.message });
    }
    if (
      error.name === "OtpException" ||
      error.name === "UserNotFoundException"
    ) {
      console.log("Error while resending the OTP", error);
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //create the otp & stored an encrypted version of it in the db
    //then send the mail with the code
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpToken = tokenService.getOtpToken(otp);
    await User.storeOTP(user.id, otpToken);
    // console.log("otpCode: ", otp);
    await sendEmail.sendConfirmationMail(user.full_name, user.email, otp);

    const userToken = tokenService.getTempUserIntoToken(user.email);
    return res
      .status(200)
      .json({ message: "User found, email sent", user_token: userToken });
  } catch (error) {
    if (error.name === "UserNotFoundException") {
      console.log("Error while logging in the user", error);
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.testMail = async (req, res) => {
  try {
    const { full_name, email } = req.body;
    await sendEmail.sendTestMail(full_name, email);
    res.json({ message: "Test mail sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
