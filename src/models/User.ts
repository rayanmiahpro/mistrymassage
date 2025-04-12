import mongoose, { Schema, Document } from "mongoose";

export interface Massage extends Document {
  content: string;
  createdAt: Date;
}

const massageSchema = new Schema<Massage>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

interface User extends Document {
  username: string;
  email: string;
  password: string;
  isMassageAllowed: boolean;
  isVarified: boolean;
  varifyCode: string;
  verifyCodeExpiry: Date;
  massages: Massage[];
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isMassageAllowed: {
    type: Boolean,
    default: true,
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  varifyCode: {
    type: String,
    required: [true, "Varify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Varify code expiry is required"],
  },
  massages: [massageSchema],
});

const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default User;
