import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("MongoDB Connected Successfully".green);
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.red);
  });

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => console.log("Server is blooming".rainbow.bold));
