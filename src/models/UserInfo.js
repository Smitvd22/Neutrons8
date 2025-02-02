import mongoose from "mongoose"

const userInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  purpose: { type: String, required: true },
  language: { type: String, required: true },
  location: { type: String, required: true },
  severity: { type: String, required: true },
  symptoms: { type: String, required: true },
  allergies: { type: String },
  medical_history: { type: String },
  emergency_contact: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
})

export default mongoose.models.UserInfo || mongoose.model("UserInfo", userInfoSchema)

