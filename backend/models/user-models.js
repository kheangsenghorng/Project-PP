import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      default: null, // Default is null if not provided by Google or Facebook
    },
    lastname: {
      type: String,
      trim: true,
      default: null, // Default is null if not provided by Google or Facebook
    },
    phonenumber: {
      type: String,
      sparse: true,
      default: null, // Default is null if not provided by Google or Facebook
    },
    profile_image: {
      type: String,
      default: null, // Default profile image for new users
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      default: null, // Optional for Google and Facebook users
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    joined_date: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
