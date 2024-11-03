import mongoose from "mongoose";

const trailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  difficulty: { type: String, required: true },
  length: Number,
  description: String,
});

export default mongoose.model("Trail", trailSchema);
