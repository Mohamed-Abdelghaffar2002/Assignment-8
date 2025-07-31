import UserModel from "../../DB/models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto-js";
import jwt from "jsonwebtoken";

export const userUpdate = async (req, res) => {
  try {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const user = await UserModel.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let { userName, userEmail, userPassword, userPhone, userAge } = req.body;
    if (userEmail) {
      const emailExists = await UserModel.findOne({ userEmail });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }
    if (userPassword) {
      return res
        .status(400)
        .json({ message: "You not allowed to update the password" });
    }
    if (userPhone) {
      const encryptedPhone = crypto.AES.encrypt(userPhone, "phoneEncryption");
      userPhone = encryptedPhone.toString();
    }
    await UserModel.findByIdAndUpdate(
      decodedToken.id,
      { userName, userEmail, userPhone, userAge },
      { new: true }
    );
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const userDelete = async (req, res) => {
  try {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const user = await UserModel.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await UserModel.findByIdAndDelete(decodedToken.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const userDataById = async (req, res) => {
  try {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const user = await UserModel.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const decryptedPhone = crypto.AES.decrypt(user.userPhone, "phoneEncryption");
    user.userPhone = decryptedPhone.toString(crypto.enc.Utf8);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
