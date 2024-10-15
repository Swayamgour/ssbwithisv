const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("token");

  // CHECK IF WE EVEN HAVE A TOKEN
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: "No token found",
        },
      ],
    });
  }

  // Validate the token format
  const parts = token.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid token format",
        },
      ],
    });
  }

  const token2 = parts[1]; // The actual token

  try {
    const user = await jwt.verify(token2, process.env.JWT_SECRET); // Verifies the token
    req.user = user; // Attaches the entire user info to the request
    next(); // Proceeds to the next middleware
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      errors: [
        {
          msg: "Invalid Token",
        },
      ],
    });
  }
};
