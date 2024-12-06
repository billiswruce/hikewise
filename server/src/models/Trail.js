import mongoose from "mongoose";

const trailSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    difficulty: { type: String, required: true },
    length: { type: Number, required: true },
    description: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    creatorId: { type: String, required: true },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    weather: {
      temperature: Number,
      description: String,
      icon: String,
    },
    usedGear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackingList",
    },
    hikeDate: { type: Date, required: true },
    hikeEndDate: { type: Date, required: true },
    packingList: {
      gear: [
        {
          name: { type: String, required: true },
          isChecked: { type: Boolean, default: false },
        },
      ],
      food: [
        {
          name: { type: String, required: true },
          isChecked: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trail", trailSchema);

//Trails: { id, name, image, location, length, difficulty, description, latitude, longitude, weather, creatorId, packingListId, CreatedAt, comment }// Gear: { id, userId, name, category, status }
//ska koppla packinglist på något sätt här - gå till trail för att skapa din packinglist och skriva kommentarer/tankar???
