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

  // Utrustning
  "Tents",
  "Sleeping Bags",
  "Sleeping Pads",
  "Backpacks",
  "Cooking Equipment",
  "Water Filtration",
  "Navigation",
  "Lighting",

  // Säkerhet
  "First Aid",
  "Emergency Equipment",
  "Communication Devices",

  // Verktyg
  "Tools",
  "Repair Kits",
  "Knives",

  // Övrigt
  "Electronics",
  "Camera Equipment",
  "Hygiene",
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
          enum: categories,
          validate: [(v) => v.length > 0, "At least one category required"],
        },
        type: { type: String, enum: ["Clothing", "Equipment"], required: true },
        packed: { type: Boolean, default: false },
        condition: {
          type: String,
          enum: ["New", "Good", "Fair", "Poor"],
          default: "Good",
        },
        brand: { type: String },
        color: { type: String },
        weight: { type: Number }, // i gram
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("OwnedGear", ownedGearSchema);
