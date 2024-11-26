import mongoose from "mongoose";

const categories = [
  "Tent",
  "Sleeping Bag",
  "Sleeping Pad",
  "Cooking",
  "Food Preparation",
  "Water Filtration",
  "Clothing",
  "Backpack",
  "Lamp",
  "Headlamp",
  "Navigation",
  "Shoes",
  "Camera",
  "First Aid",
  "Fishing Gear",
  "Miscellaneous",
];

const ownedGearSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: { type: String, required: true, minlength: 3 },
        quantity: { type: Number, required: true, min: 1 },
        categories: {
          type: [String],
          enum: categories,
          required: true,
          validate: [(v) => v.length <= 3, "Maximum 3 categories allowed"],
        },
        type: { type: String, enum: ["Gear", "Food"], required: true },
        packed: { type: Boolean, default: false },
        condition: {
          type: String,
          enum: ["Good", "Okay", "Poor"],
          default: "Good",
        },
        needsToBuy: { type: Boolean, default: false },
        needsRenewal: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("OwnedGear", ownedGearSchema);
