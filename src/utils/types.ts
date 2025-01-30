import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
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
  status: "";
}
