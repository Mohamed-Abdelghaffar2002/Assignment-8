import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    userAge: {
      type: Number,
      min: 18,
      max: 60,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

export default UserModel;
