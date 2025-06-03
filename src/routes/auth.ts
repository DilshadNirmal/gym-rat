import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const auth = new Hono();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  role: z.enum(["ADMIN", "GYM_OWNER", "MEMBER"])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

function scrypt(password, salt, options) {
    const { N, r, p, dkLen } = options;
    return scryptSync(password, salt, dkLen, {
        cost: N,
        blockSize: r,
        parallelization: p
    });
}

auth.post("/register", zValidator("json", registerSchema), async (c) => {
  try {
    const { name, email, password, phone, role } = c.req.valid("json");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Hash password
    const salt = randomBytes(16);
    const hashedPassword = Buffer.concat([salt, scrypt(password, salt, { N: 2**14, r: 8, p: 1, dkLen: 32 })]).toString('hex');
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return c.json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return c.json({ error: "Registration failed" }, 500);
  }
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid("json");

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Verify password
    const storedHash = Buffer.from(user.password, 'hex');
    const salt = storedHash.slice(0, 16);
    const hash = storedHash.slice(16);
    const verifyHash = scrypt(password, salt, { N: 2**14, r: 8, p: 1, dkLen: 32 });
    const isValidPassword = Buffer.compare(hash, verifyHash) === 0;

    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return c.json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return c.json({ error: "Login failed" }, 500);
  }
});

export { auth };