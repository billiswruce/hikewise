import mongoose from "mongoose";

// Define the categories for gear and food (can be expanded as needed)
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
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        categories: { type: [String], enum: categories, required: true },
        type: { type: String, enum: ["Gear", "Food"], required: true }, // Either "Gear" or "Food"
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
