import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  auth0Id: String,
  favoriteTrails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trail" }],
  ownedGear: Array,
});
//   username: { type: String, required: false },
//   email: { type: String, required: true, unique: false },
//   auth0Id: { type: String, required: true, unique: true },
//   favoriteTrails: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "FavoriteTrails" },
//   ],
//   ownedGear: [{ type: mongoose.Schema.Types.ObjectId, ref: "OwnedGear" }],
// });

export default mongoose.model("User", userSchema);
