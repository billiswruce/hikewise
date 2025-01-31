import User from "../models/User.js";

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("ownedGear")
      .populate("favoriteTrails");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId).populate("favoriteTrails");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favoriteTrails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trailId = req.params.trailId;
    const favoriteIndex = user.favoriteTrails.indexOf(trailId);

    if (favoriteIndex > -1) {
      user.favoriteTrails.splice(favoriteIndex, 1);
    } else {
      user.favoriteTrails.push(trailId);
    }
    await user.save();

    res.status(200).json({
      message:
        favoriteIndex > -1 ? "Removed from favorites" : "Added to favorites",
      favorites: user.favoriteTrails,
    });
  } catch (error) {
    console.error(
      `Error in toggleFavorite - userId: ${req.session?.userId}, trailId: ${req.params.trailId}:`,
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addGear = async (req, res) => {
  const { name, quantity, condition, category } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.ownedGear.push({
      name,
      quantity,
      condition,
      category,
      packed: false,
    });
    await user.save();

    res.status(200).json({
      message: "Gear item added successfully",
      gear: user.ownedGear,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
