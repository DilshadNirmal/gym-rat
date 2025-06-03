
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Gym } from "../models/Gym";
import { authMiddleware, requireRole } from "../middleware/auth";

const gyms = new Hono();

const createGymSchema = z.object({
  name: z.string().min(2),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string()
  }),
  subscription: z.object({
    plan: z.enum(["BASIC", "PRO", "PREMIUM", "ENTERPRISE"])
  })
});

gyms.use("*", authMiddleware);

gyms.post("/", 
  requireRole(["ADMIN", "GYM_OWNER"]), 
  zValidator("json", createGymSchema), 
  async (c) => {
    try {
      const user = c.get("user");
      const { name, location, subscription } = c.req.valid("json");
      
      const gym = new Gym({
        name,
        owner: user._id,
        location,
        subscription: {
          ...subscription,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          status: "ACTIVE"
        },
        members: []
      });

      await gym.save();
      
      return c.json({
        status: "success",
        message: "Gym created successfully",
        gym
      });
    } catch (error) {
      return c.json({ error: "Failed to create gym" }, 500);
    }
  }
);

gyms.get("/", async (c) => {
  try {
    const user = c.get("user");
    let gyms;
    
    if (user.role === "ADMIN") {
      gyms = await Gym.find().populate("owner", "name email");
    } else {
      gyms = await Gym.find({ owner: user._id });
    }
    
    return c.json({
      status: "success",
      gyms
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch gyms" }, 500);
  }
});

gyms.get("/:id", async (c) => {
  try {
    const gymId = c.req.param("id");
    const gym = await Gym.findById(gymId).populate("owner", "name email");
    
    if (!gym) {
      return c.json({ error: "Gym not found" }, 404);
    }
    
    return c.json({
      status: "success",
      gym
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch gym" }, 500);
  }
});

export { gyms };
