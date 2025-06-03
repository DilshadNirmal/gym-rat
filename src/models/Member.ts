
import { Schema, model } from "mongoose";
import { IMember } from "../utils/types";

const memberSchema = new Schema<IMember>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  gymId: { type: Schema.Types.ObjectId, ref: "Gym", required: true },
  membershipType: { 
    type: String, 
    enum: ["MONTHLY", "QUARTERLY", "YEARLY"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["ACTIVE", "INACTIVE", "CANCELLED", "ON_HOLD"], 
    required: true 
  },
  personalInfo: {
    height: { type: Number },
    weight: { type: Number },
    bloodGroup: { type: String },
    medicalConditions: [{ type: String }]
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true }
    }
  },
  attendance: [{
    date: { type: Date, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    verificationMethod: { 
      type: String, 
      enum: ["QR", "MANUAL", "PHOTO"], 
      required: true 
    }
  }],
  payments: [{
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["PENDING", "SUCCESS", "FAILED"], 
      required: true 
    },
    transactionId: { type: String, required: true },
    paymentMethod: { 
      type: String, 
      enum: ["CASH", "CARD", "UPI"], 
      required: true 
    }
  }]
}, {
  timestamps: true
});

export const Member = model<IMember>("Member", memberSchema);
