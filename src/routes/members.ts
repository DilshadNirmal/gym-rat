
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Member } from "../models/Member";
import { Gym } from "../models/Gym";
import { authMiddleware, requireRole } from "../middleware/auth";

const members = new Hono();

const addMemberSchema = z.object({
  userId: z.string(),
  gymId: z.string(),
  membershipType: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  personalInfo: z.object({
    height: z.number().optional(),
    weight: z.number().optional(),
    bloodGroup: z.string().optional(),
    medicalConditions: z.array(z.string()).optional()
  }).optional(),
  contact: z.object({
    phone: z.string(),
    email: z.string().email(),
    emergencyContact: z.object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string()
    })
  })
});

members.get("/", authMiddleware, async (c) => {
  try {
    const gymId = c.req.query("gymId");
    const user = c.get("user");
    
    let query = {};
    if (gymId) {
      query = { gymId };
    } else if (user.role === "GYM_OWNER") {
      const userGyms = await Gym.find({ owner: user._id });
      const gymIds = userGyms.map(gym => gym._id);
      query = { gymId: { $in: gymIds } };
    }
    
    const membersList = await Member.find(query).populate("userId", "name email").populate("gymId", "name");
    return c.json({ members: membersList });
  } catch (error) {
    return c.json({ error: "Failed to fetch members" }, 500);
  }
});

members.post("/", authMiddleware, requireRole(["ADMIN", "GYM_OWNER"]), zValidator("json", addMemberSchema), async (c) => {
  try {
    const memberData = c.req.valid("json");
    
    const member = new Member(memberData);
    await member.save();
    
    return c.json({ status: "success", message: "Member added successfully", member });
  } catch (error) {
    return c.json({ error: "Failed to add member" }, 500);
  }
});

const attendanceSchema = z.object({
  memberId: z.string(),
  verificationMethod: z.enum(["QR", "MANUAL", "PHOTO"])
});

members.use("*", authMiddleware);

members.post("/", 
  requireRole(["ADMIN", "GYM_OWNER"]), 
  zValidator("json", addMemberSchema), 
  async (c) => {
    try {
      const { userId, gymId, membershipType, personalInfo, contact } = c.req.valid("json");
      
      const member = new Member({
        userId,
        gymId,
        membershipType,
        status: "ACTIVE",
        personalInfo,
        contact,
        attendance: [],
        payments: []
      });

      await member.save();
      
      // Add member to gym
      await Gym.findByIdAndUpdate(gymId, {
        $push: { members: member._id }
      });
      
      return c.json({
        status: "success",
        message: "Member added successfully",
        member
      });
    } catch (error) {
      return c.json({ error: "Failed to add member" }, 500);
    }
  }
);

members.post("/attendance", 
  zValidator("json", attendanceSchema), 
  async (c) => {
    try {
      const { memberId, verificationMethod } = c.req.valid("json");
      
      const member = await Member.findById(memberId);
      if (!member) {
        return c.json({ error: "Member not found" }, 404);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingAttendance = member.attendance.find(
        att => att.date.getTime() === today.getTime()
      );

      if (existingAttendance && !existingAttendance.checkOut) {
        // Check out
        existingAttendance.checkOut = new Date();
        await member.save();
        
        return c.json({
          status: "success",
          message: "Checked out successfully",
          attendance: existingAttendance
        });
      } else if (!existingAttendance) {
        // Check in
        member.attendance.push({
          date: today,
          checkIn: new Date(),
          checkOut: undefined as any,
          verificationMethod
        });
        await member.save();
        
        return c.json({
          status: "success",
          message: "Checked in successfully"
        });
      } else {
        return c.json({ error: "Already completed attendance for today" }, 400);
      }
    } catch (error) {
      return c.json({ error: "Failed to mark attendance" }, 500);
    }
  }
);

members.get("/gym/:gymId", async (c) => {
  try {
    const gymId = c.req.param("gymId");
    const members = await Member.find({ gymId }).populate("userId", "name email");
    
    return c.json({
      status: "success",
      members
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch members" }, 500);
  }
});

export { members };
