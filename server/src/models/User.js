import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  favoriteTrails: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FavoriteTrails" },
  ],
  ownedGear: { type: mongoose.Schema.Types.ObjectId, ref: "OwnedGear" },
});

export default mongoose.model("User", userSchema);
