
import { Schema, model } from "mongoose";
import { IUser } from "../utils/types";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["ADMIN", "GYM_OWNER", "MEMBER"], 
    required: true 
  }
}, {
  timestamps: true
});

export const User = model<IUser>("User", userSchema);
