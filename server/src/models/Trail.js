import mongoose from "mongoose";

const trailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  difficulty: { type: String, required: true },
  length: { type: Number, required: true },
  description: String,
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  weather: {
    temperature: Number,
    description: String,
    icon: String,
  },
  recommendedPackingList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecommendedPackingList",
  },
});

export default mongoose.model("Trail", trailSchema);
