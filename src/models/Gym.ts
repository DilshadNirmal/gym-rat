
import { Schema, model } from "mongoose";
import { IGym } from "../utils/types";

const gymSchema = new Schema<IGym>({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  subscription: {
    plan: { 
      type: String, 
      enum: ["BASIC", "PRO", "PREMIUM", "ENTERPRISE"], 
      required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["ACTIVE", "EXPIRED", "CANCELLED", "ON_HOLD"], 
      required: true 
    }
  },
  members: [{ type: Schema.Types.ObjectId, ref: "Member" }]
}, {
  timestamps: true
});

export const Gym = model<IGym>("Gym", gymSchema);
