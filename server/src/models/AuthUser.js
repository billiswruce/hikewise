import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false },
  },
  { timestamps: true }
);

const AuthUser = mongoose.model("AuthUser", userSchema);

export default AuthUser;
