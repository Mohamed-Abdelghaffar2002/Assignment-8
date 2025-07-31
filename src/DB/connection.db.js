import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://root:RTc3AIVXefOv0iG9@cluster0.nrlw0bt.mongodb.net/assignment8"
    );
    console.log("MongoDB connected successfully 👌.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default dbConnection;
