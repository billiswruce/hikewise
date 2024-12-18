import mongoose from "mongoose";

const categories = [
  // Kläder
  "Jackets",
  "Pants",
  "Base Layers",
  "Socks",
  "Rain Gear",
  "Gloves",
  "Hats",
  "Shoes",
  "Other",

  // Utrustning
  "Tents",
  "Sleeping Bags",
  "Sleeping Pads",
  "Backpacks",
  "Cooking Equipment",
  "Water Filtration",
  "Navigation",
  "Lighting",
  "First Aid",
  "Tools",
  "Electronics",
  "Other",

  // Mat
  "Freeze-Dried Meals",
  "Canned Food",
  "Instant Noodles",
  "Trail Mix",
  "Energy Bars",
  "Dried Fruit",
  "Instant Coffee",
  "Powdered Drink Mix",
  "Tea",
  "Other",
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
        type: {
          type: String,
          enum: ["Clothing", "Equipment", "Food"],
          required: true,
        },
        packed: { type: Boolean, default: false },
        condition: {
          type: String,
          enum: ["New", "Good", "Fair", "Poor"],
          default: "Good",
        },
        brand: { type: String, default: "" },
        color: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("OwnedGear", ownedGearSchema);
