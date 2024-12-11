import OwnedGear from "../models/OwnedGear.js";

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
  try {
    const userId = req.user?.id;
    console.log("Received userId:", userId); // Logga userId
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, quantity, condition, categories, brand, color } = req.body;
    console.log("Received item data:", req.body); // Logga inkommande data

    let ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      console.log("Creating new OwnedGear document for userId:", userId);
      ownedGear = new OwnedGear({ userId, items: [] });
    }

    ownedGear.items.push({
      name,
      quantity,
      type: "Gear",
      condition,
      categories,
      packed: false,
      brand,
      color,
    });

    console.log("OwnedGear before save:", ownedGear); // Före .save()
    await ownedGear.save();
    console.log("OwnedGear after save:", ownedGear); // Efter .save()

    res.status(201).json({
      message: "Gear item added successfully",
      item: ownedGear.items[ownedGear.items.length - 1],
    });
  } catch (error) {
    console.error("Error in addGearItem:", error);
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

export const getGearByType = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.error("No user ID found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type } = req.query;
    if (!type) {
      console.error("No type provided in query");
      return res.status(400).json({ message: "Type parameter is required" });
    }

    console.log(`Fetching gear for user ${userId} with type ${type}`);

    const ownedGear = await OwnedGear.findOne({ userId });
    console.log("Found owned gear:", ownedGear);

    if (!ownedGear) {
      return res.status(200).json([]);
    }

    const filteredItems = ownedGear.items.filter((item) =>
      item.categories.includes(type)
    );
    console.log("Filtered items:", filteredItems);

    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error in getGearByType:", error);
    res.status(500).json({
      message: "Error fetching filtered gear items.",
      error: error.message,
    });
  }
};
