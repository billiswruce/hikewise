import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

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
    creatorId: { type: String, required: true },
    comments: [commentSchema],
    weather: {
      temperature: Number,
      description: String,
      icon: String,
    },
    usedGear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackingList",
    },
    hikeDate: { type: Date, required: true },
    hikeEndDate: { type: Date, required: true },
    packingList: {
      gear: [
        {
          name: { type: String, required: true },
          isChecked: { type: Boolean, default: false },
        },
      ],
      food: [
        {
          name: { type: String, required: true },
          isChecked: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trail", trailSchema);
