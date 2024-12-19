export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Full request details:", {
      path: req.path,
      headers: req.headers,
      cookies: req.cookies,
      session: req.session,
      sessionID: req.sessionID,
    });

    if (!req.session) {
      console.log("No session object");
      return res.status(401).json({ message: "No session found" });
    }

    if (!req.session.userId) {
      console.log("No userId in session");
      return res.status(401).json({ message: "Please log in to continue" });
    }

    // Set user info on request object
    req.user = { id: req.session.userId };
    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      message: "Authentication failed",
      error: error.message,
      details: {
        hasSession: !!req.session,
        sessionId: req.sessionID,
        cookies: req.cookies,
      },
    });
  }
};
