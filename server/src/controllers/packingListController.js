import PackingList from "../models/PackingList.js";

export const createPackingList = async (req, res) => {
  const { trailId, items } = req.body;
  try {
    const packingList = new PackingList({ trailId, items });
    const savedPackingList = await packingList.save();
    res.status(201).json(savedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackingList = async (req, res) => {
  try {
    const packingList = await PackingList.findOne({
      trailId: req.params.trailId,
    });
    if (!packingList)
      return res.status(404).json({ message: "Packing list not found" });
    res.status(200).json(packingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
