import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "ADMIN" | "GYM_OWNER" | "MEMBER";
  createdAt: Date;
  updatedAt: Date;
}

export interface IGym {
  _id: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  subscription: {
    plan: "BASIC" | "PRO" | "PREMIUM" | "ENTERPRISE";
    startDate: Date;
    endDate: Date;
    status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "ON_HOLD";
  };
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  gymId: Types.ObjectId;
  membershipType: "MONTHLY" | "QUARTERLY" | "YEARLY";
  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "ON_HOLD";
  personalInfo: {
    height?: number;
    weight?: number;
    bloodGroup?: string;
    medicalConditions?: string[];
  };
  contact: {
    phone: string;
    email: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  attendance: {
    date: Date;
    checkIn: Date;
    checkOut: Date;
    verificationMethod: "QR" | "MANUAL" | "PHOTO";
  }[];
  payments: {
    amount: number;
    date: Date;
    status: "PENDING" | "SUCCESS" | "FAILED";
    transactionId: string;
    paymentMethod: "CASH" | "CARD" | "UPI";
  }[];
  createdAt: Date;
  updatedAt: Date;
}
