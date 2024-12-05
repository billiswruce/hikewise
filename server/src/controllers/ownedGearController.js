import OwnedGear from "../models/ownedGear.js";

export const getOwnedGear = async (req, res) => {
  try {
    const userId = req.user.id;
    const ownedGear = await OwnedGear.findOne({ userId }).populate("userId");

    if (!ownedGear) {
      return res
        .status(404)
        .json({ message: "No gear found for the specified user." });
    }

    const gearItems = ownedGear.items.filter((item) => item.type === "Gear");
    const foodItems = ownedGear.items.filter((item) => item.type === "Food");

    res.status(200).json({
      gear: gearItems,
      food: foodItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching gear and food items" });
  }
};

export const addGearItem = async (req, res) => {
  const { name, quantity, type, condition, categories } = req.body;
  const userId = req.user.id;

  try {
    let ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      ownedGear = new OwnedGear({ userId, items: [] });
    }
    ownedGear.items.push({
      name,
      quantity,
      type,
      condition,
      categories,
      packed: false,
    });

    await ownedGear.save();

    res.status(201).json({ message: "Gear item added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding gear item" });
  }
};

export const updateGearItem = async (req, res) => {
  const { name, quantity, condition, packed, type, categories } = req.body;
  const userId = req.user.id;

  try {
    const ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      return res
        .status(404)
        .json({ message: "No gear found for the specified user." });
    }

    const item = ownedGear.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Gear item not found" });
    }

    if (name) item.name = name;
    if (quantity) item.quantity = quantity;
    if (condition) item.condition = condition;
    if (packed !== undefined) item.packed = packed;
    if (type) item.type = type;
    if (categories) item.categories = categories;

    await ownedGear.save();

    res.status(200).json({ message: "Gear item updated successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating gear item" });
  }
};

export const deleteGearItem = async (req, res) => {
  const userId = req.user.id;

  try {
    const ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      return res
        .status(404)
        .json({ message: "No gear found for the specified user." });
    }

    const item = ownedGear.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Gear item not found" });
    }

    item.remove();
    await ownedGear.save();

    res.status(200).json({ message: "Gear item removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting gear item" });
  }
};
