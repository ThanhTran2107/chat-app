import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
