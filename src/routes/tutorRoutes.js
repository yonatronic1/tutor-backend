import express from "express";
import jwt from "jsonwebtoken";
import Tutor from "../models/Tutor.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, price, subjects } = req.body;
    if (!name || !email || !password || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const exists = await Tutor.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const tutor = await Tutor.create({
      name,
      email,
      password,
      price,
      subjects: Array.isArray(subjects) ? subjects : []
    });

    return res.status(201).json({ id: tutor._id });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

    const tutor = await Tutor.findOne({ email });
    if (!tutor) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await tutor.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: tutor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;
    const query = subject ? { subjects: subject } : {};
    const tutors = await Tutor.find(query).select("-password");
    return res.json(tutors);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).select("-password");
    if (!tutor) return res.status(404).json({ error: "Not found" });
    return res.json(tutor);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;