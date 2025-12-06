import express from "express";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const exists = await Student.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const student = await Student.create({ name, email, password });
    return res.status(201).json({ id: student._id });
  } catch {
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await student.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;