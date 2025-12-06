import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tutorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    price: { type: Number, required: true },
    subjects: { type: [String], default: [] }
  },
  { timestamps: true }
);

tutorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

tutorSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("Tutor", tutorSchema);