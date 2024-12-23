import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("=== Auth Middleware ===");
    console.log("Session:", {
      id: req.session?.id,
      userId: req.session?.userId,
      cookie: req.session?.cookie,
    });
    console.log("Headers:", {
      cookie: req.headers.cookie,
      origin: req.headers.origin,
    });

    if (!req.session?.userId) {
      console.log("No session userId found");
      return res.status(401).json({ message: "Please log in to continue" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};
