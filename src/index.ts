
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { connect } from "mongoose";

const app = new Hono();

// middlware
app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", logger());

import { auth } from "./routes/auth";
import { gyms } from "./routes/gyms";
import { members } from "./routes/members";

app.get("/", (c) => {
  return c.json({
    status: "success",
    message: "Welcome to GymRat API 🏋️‍♂️",
  });
});

// Routes
app.route("/api/auth", auth);
app.route("/api/gyms", gyms);
app.route("/api/members", members);

// mongodb connection
const MONGODB_URI = process.env.MONGODB_URI || "chumma value";
const PORT = process.env.PORT || 3030;

connect(MONGODB_URI)
  .then(() => console.log("📦 Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default {
  fetch: app.fetch,
  port: PORT,
};
