import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  auth0Id: String,
  favoriteTrails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trail" }],
  ownedGear: Array,
});

export default mongoose.model("User", userSchema);
