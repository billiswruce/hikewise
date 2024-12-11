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
      ref: "AuthUser",
      required: true,
    },
    items: [
      {
        name: { type: String, required: true, minlength: 3 },
        quantity: { type: Number, required: true, min: 1 },
        categories: {
          type: [String],
          required: true,
          validate: [(v) => v.length > 0, "At least one category required"],
        },
        type: { type: String, enum: ["Gear"], required: true },
        packed: { type: Boolean, default: false },
        condition: {
          type: String,
          enum: ["Good", "Okay", "Poor"],
          default: "Good",
        },
        brand: { type: String },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("OwnedGear", ownedGearSchema);
