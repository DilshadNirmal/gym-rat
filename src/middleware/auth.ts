
import { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "No token provided" }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    c.set("user", user);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};

export const requireRole = (roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user || !roles.includes(user.role)) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }
    await next();
  };
};
