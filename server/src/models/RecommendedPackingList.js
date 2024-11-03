import mongoose from "mongoose";

const recommendedPackingListSchema = new mongoose.Schema({
  trailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trail",
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.model(
  "RecommendedPackingList",
  recommendedPackingListSchema
);
