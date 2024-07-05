const supabase = require("../config/supabaseClient");
const exceptions = require("../utils/exceptions");

class User {
   static toJson(user) {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    };
  }


  static async create(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .eq("email", userData.email)
      .single();
    if (error) throw new exceptions.DbException("Error while creating user");
    return data;
  }

  static async verifyEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);
    if (error) {
      console.log("Db error:", error);
      throw new exceptions.DbException("Error while getting user");
    }
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.log("Db error:", error);
      throw new exceptions.DbException("Error while getting user");
    }
    if (!data || data.length == 0) throw new exceptions.UserNotFoundException("User not found");
    return data[0];

  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.log("Db error:", error);
      throw new exceptions.DbException("Error while getting user");
    }
    if (!data) throw new exceptions.UserNotFoundException("User not found");
    return data;
  }

  //get otp
  static async getOTP(id) {
    const { data, error } = await supabase
      .from("users")
      .select("otp")
      .eq("id", id)
      .single();
    if (error) throw new exceptions.DbException("Error while getting OTP");
    if (!data) throw new exceptions.OtpException("No OTP found");
    return data.otp;
  }

  //store otp
  static async storeOTP(id, otp) {
    const { data, error } = await supabase
      .from("users")
      .update({ otp })
      .eq("id", id);
    if (error) {
      console.log("DbError:", error);
      throw new exceptions.DbException("Error while storing OTP");
    }
    console.log(data);
    return data;
  }

  //validate user input
  //validate full_name & email & verify password is at least 8 characters
  static async validateRegisterInput(full_name, email, password) {
    if (full_name.length < 1) {
      throw new exceptions.UserInputException(
        "Full name must be at least 3 characters"
      );
    }
    if (!email.includes("@") || !email.includes(".")) {
      throw new exceptions.UserInputException("Invalid email");
    }
    if (password.length < 8) {
      throw new exceptions.UserInputException(
        "Password must be at least 8 characters"
      );
    }
    //if user already exists
    if ((await User.verifyEmail(email)).length > 0) {
      throw new exceptions.UserExistsException("User already exists");
    }
    return null;
  }
}

module.exports = User;
