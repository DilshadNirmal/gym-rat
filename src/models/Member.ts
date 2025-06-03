
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
    default: "ACTIVE" 
  },
  personalInfo: {
    height: Number,
    weight: Number,
    bloodGroup: String,
    medicalConditions: [String]
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
    date: { type: Date, default: Date.now },
    checkIn: Date,
    checkOut: Date,
    verificationMethod: { 
      type: String, 
      enum: ["QR", "MANUAL", "PHOTO"] 
    }
  }],
  payments: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ["PENDING", "SUCCESS", "FAILED"], 
      default: "PENDING" 
    },
    transactionId: String,
    paymentMethod: { 
      type: String, 
      enum: ["CASH", "CARD", "UPI"] 
    }
  }]
}, {
  timestamps: true
});

export const Member = model<IMember>("Member", memberSchema);
