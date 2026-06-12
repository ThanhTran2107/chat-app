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
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String }, // avatar image URL stored on Cloudinary
    avatarId: { type: String }, // Cloudinary public_id for deleting the image
    bio: { type: String, trim: true, maxlength: 500 },
    phoneNumber: { type: String, trim: true, parse: true },
    showOnlineStatus: { type: Boolean, default: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
