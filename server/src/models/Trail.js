import mongoose from "mongoose";

const trailSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    difficulty: { type: String, required: true },
    length: { type: Number, required: true },
    description: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    weather: {
      temperature: Number,
      description: String,
      icon: String,
    },
    usedGear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecommendedPackingList",
    },
    hikeDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Trail", trailSchema);

// vill kunna filtrera på difficulty , simple walk, easy hike, medium, hard, epic
//Trails: { id, name, image, location, length, difficulty, description, latitude, longitude, weather, creatorId, packingListId, CreatedAt, comment }// Gear: { id, userId, name, category, status }
