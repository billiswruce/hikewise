import mongoose from "mongoose";

const favoriteTrailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trail",
    required: true,
  },
});

export default mongoose.model("FavoriteTrails", favoriteTrailsSchema);
