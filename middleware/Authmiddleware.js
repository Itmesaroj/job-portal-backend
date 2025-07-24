const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).send("Authentication required");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).send("Invalid token");
    }
    console.log("decoded",decoded.id)
    req.body.id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).send("Token verification failed");
  }
};

module.exports = authMiddleware;
