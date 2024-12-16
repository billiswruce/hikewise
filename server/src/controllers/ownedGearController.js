import OwnedGear from "../models/ownedGear.js";

// Hämta alla gear-items för en användare
export const getOwnedGear = async (req, res) => {
  try {
    const userId = req.user.id;
    const ownedGear = await OwnedGear.findOne({ userId });

    if (!ownedGear) {
      return res.status(200).json([]);
    }

    res.status(200).json(ownedGear.items);
  } catch (error) {
    console.error("Error fetching gear:", error);
    res.status(500).json({ message: "Error fetching gear items" });
  }
};

// Lägg till ett nytt gear-item
export const addGearItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, quantity, condition, categories, type, brand, color } =
      req.body;

    if (!userId || !name || !type || !categories) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowedTypes = ["Clothing", "Equipment", "Food"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid gear type" });
    }

    let ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      ownedGear = new OwnedGear({ userId, items: [] });
    }

    const newItem = {
      name,
      quantity: quantity || 1,
      type,
      condition: condition || "Good",
      categories: categories.length > 0 ? categories : [type],
      packed: false,
      brand: brand || "",
      color: color || "",
    };

    ownedGear.items.push(newItem);
    await ownedGear.save();

    res.status(201).json({
      message: "Gear item added successfully",
      item: ownedGear.items[ownedGear.items.length - 1],
    });
  } catch (error) {
    console.error("Error adding gear item:", error);
    res.status(500).json({ message: "Error adding gear item" });
  }
};

// Uppdatera ett gear-item
export const updateGearItem = async (req, res) => {
  const { name, quantity, condition, packed, type, categories, brand, color } =
    req.body;
  const userId = req.user.id;

  try {
    const ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      return res
        .status(404)
        .json({ message: "No gear found for the specified user." });
    }

    const itemIndex = ownedGear.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Gear item not found" });
    }

    // Update only the provided fields
    const updatedItem = {
      ...ownedGear.items[itemIndex].toObject(),
      ...(name && { name }),
      ...(quantity && { quantity }),
      ...(condition && { condition }),
      ...(packed !== undefined && { packed }),
      ...(type && { type }),
      ...(categories && { categories }),
      ...(brand && { brand }),
      ...(color && { color }),
    };

    ownedGear.items[itemIndex] = updatedItem;
    await ownedGear.save();

    res
      .status(200)
      .json({ message: "Gear item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating gear item:", error);
    res
      .status(500)
      .json({ message: "Error updating gear item", error: error.message });
  }
};

// Ta bort ett gear-item
export const deleteGearItem = async (req, res) => {
  const userId = req.user.id;

  try {
    const ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) {
      return res
        .status(404)
        .json({ message: "No gear found for the specified user." });
    }

    // Filter out the item to be deleted
    ownedGear.items = ownedGear.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await ownedGear.save();
    res.status(200).json({ message: "Gear item removed successfully" });
  } catch (error) {
    console.error("Error deleting gear item:", error);
    res
      .status(500)
      .json({ message: "Error deleting gear item", error: error.message });
  }
};

// Hämta gear efter typ (Clothing, Equipment, Food)
export const getGearByType = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { type } = req.query;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!type)
      return res.status(400).json({ message: "Type parameter is required" });

    const ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) return res.status(200).json([]);

    if (type === "All") {
      return res.status(200).json(ownedGear.items);
    }

    const filteredItems = ownedGear.items.filter((item) => item.type === type);
    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error fetching gear by type:", error);
    res.status(500).json({ message: "Error fetching filtered gear items" });
  }
};

export const getGearByCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { category } = req.query;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!category) {
      return res
        .status(400)
        .json({ message: "Category parameter is required" });
    }

    const ownedGear = await OwnedGear.findOne({ userId });
    if (!ownedGear) return res.status(200).json([]);

    const filteredItems = ownedGear.items.filter((item) =>
      item.categories.includes(category)
    );

    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error fetching gear by category:", error);
    res.status(500).json({ message: "Error fetching filtered gear items" });
  }
};
