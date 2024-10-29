import express from "express";
import dotenv from "dotenv";
import "colors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

app.listen(PORT, () => console.log("🚀 Server is blooming".rainbow.bold));
