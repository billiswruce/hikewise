import express from "express";
import PackingList from "../models/PackingList.js"; // Importera den nya PackingList-modellen
import Trail from "../models/Trail.js"; // Om du behöver Trail-modellen

const router = express.Router();

// Skapa en ny packlista och koppla den till en trail
router.post("/", async (req, res) => {
  const { trailId, items } = req.body;

  try {
    // Först, skapa den faktiska packlistan
    const packingList = new PackingList({
      trailId,
      items,
    });

    // Spara packlistan
    const savedPackingList = await packingList.save();

    res.status(201).json(savedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta en packlista för en viss trail
router.get("/:trailId", async (req, res) => {
  try {
    // Hämta packlistan baserat på trailId
    const packingList = await PackingList.findOne({
      trailId: req.params.trailId,
    });

    if (!packingList) {
      return res
        .status(404)
        .json({ message: "Packing list not found for the given trail" });
    }

    res.status(200).json(packingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
