import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    sub: { type: String, required: true, unique: true }, // Auth0-användar-ID
    name: { type: String },
    email: { type: String, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
