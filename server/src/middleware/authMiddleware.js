import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({
        message: "No active session",
        code: "NO_SESSION",
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Server error",
      code: "SERVER_ERROR",
    });
  }
};
