import jwt from "jsonwebtoken";
import { registerTutor, loginTutor, listTutors } from "../services/tutorService.js";

export async function register(req, res) {
  try {
    const tutor = await registerTutor(req.body);
    res.json({ message: "Tutor registered successfully", tutor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const tutor = await loginTutor(req.body);
    const token = jwt.sign({ id: tutor._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, tutor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getTutors(req, res) {
  try {
    const tutors = await listTutors();
    res.json(tutors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tutors" });
  }
}