import mongoose from "mongoose";

const packingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      name: String,
      quantity: Number,
      packed: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.model("PackingList", packingListSchema);
