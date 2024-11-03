import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionStatus: { type: String, default: "free" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trail" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  packingList: { type: mongoose.Schema.Types.ObjectId, ref: "PackingList" },
});

export default mongoose.model("User", userSchema);
