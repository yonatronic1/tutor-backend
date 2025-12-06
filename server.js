import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// ✅ Allow frontend origins (local + Vercel)
app.use(cors({
  origin: ["http://localhost:5173", "https://tutor-frontend.vercel.app"],
  credentials: true
}));

app.use(express.json());

// ✅ Env check
const requiredVars = ["MONGO_URI", "JWT_SECRET"];
for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`Missing env: ${v}`);
    process.exit(1);
  }
}

// ✅ MongoDB connect
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }

  // ✅ Tutor schema/model
  const tutorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    rate: { type: Number, required: true }
  }, { timestamps: true });

  const Tutor = mongoose.models.Tutor || mongoose.model("Tutor", tutorSchema);

  // ✅ Routes
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/tutors", async (req, res, next) => {
    try {
      const tutors = await Tutor.find().lean();
      res.json({ ok: true, data: tutors });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/tutors", async (req, res, next) => {
    try {
      const { name, subject, rate } = req.body;
      if (!name || !subject || typeof rate !== "number") {
        return res.status(400).json({ ok: false, error: "INVALID_INPUT" });
      }
      const tutor = await Tutor.create({ name, subject, rate });
      res.status(201).json({ ok: true, data: tutor });
    } catch (e) {
      next(e);
    }
  });

  // ✅ Error handler
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  });

  // ✅ Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();