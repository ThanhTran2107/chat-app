import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
    avatarId: { type: String },
    bio: { type: String, trim: true, maxlength: 500 },
    phoneNumber: { type: String, trim: true, parse: true },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
