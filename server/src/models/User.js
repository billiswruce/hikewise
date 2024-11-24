import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trail" }],
  ownedGear: { type: mongoose.Schema.Types.ObjectId, ref: "Gear" },
});

export default mongoose.model("User", userSchema);

//// Users: { id, name, email, authProvider, password, savedTrails[], gear[] }
