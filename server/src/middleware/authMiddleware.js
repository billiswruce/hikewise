export const isAuthenticated = (req, res, next) => {
  console.log("Session data:", req.session);
  if (req.session.userId) {
    req.user = { id: req.session.userId };
    console.log("Authenticated user ID:", req.user.id);
    return next();
  }
  console.warn("Unauthorized access - no session userId");
  return res.status(401).json({ message: "Unauthorized" });
};
