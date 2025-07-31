import UserModel from "../../DB/models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto-js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { userName, userEmail, userPassword, userPhone, userAge } = req.body;
    const emailExists = await UserModel.findOne({ userEmail });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const encryptedPhone = crypto.AES.encrypt(userPhone, "phoneEncryption");
    const user = await UserModel.create({
      userName,
      userEmail,
      userPassword: hashedPassword,
      userPhone: encryptedPhone,
      userAge,
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logIn = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    const userExists = await UserModel.findOne({ userEmail });
    if (!userExists) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const matchPass = bcrypt.compareSync(userPassword, userExists.userPassword);
    if (!matchPass) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: userExists._id }, "userToken", { expiresIn: "1h" });
    return res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  