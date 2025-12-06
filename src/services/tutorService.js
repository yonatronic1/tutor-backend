import Tutor from "../models/Tutor.js";
import bcrypt from "bcryptjs";

export async function registerTutor({ name, subject, email, password, price }) {
  const existing = await Tutor.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const tutor = await Tutor.create({ name, subject, email, password: hashed, price });
  return tutor;
}

export async function loginTutor({ email, password }) {
  const tutor = await Tutor.findOne({ email });
  if (!tutor) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, tutor.password);
  if (!match) throw new Error("Invalid credentials");

  return tutor;
}

export async function listTutors() {
  return Tutor.find();
}