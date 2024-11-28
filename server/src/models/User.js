import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
  favoriteTrails: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FavoriteTrails" },
  ],
  ownedGear: { type: mongoose.Schema.Types.ObjectId, ref: "OwnedGear" },
});

export default mongoose.model("User", userSchema);
