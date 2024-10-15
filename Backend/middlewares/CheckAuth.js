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

  try {
    const token2 = token.split(" ")[1];  // Assumes token format like: 'Bearer <token>'
    const user = await jwt.verify(token2, process.env.JWT_SECRET);  // Verifies the token
    req.user = user.email;  // Attaches the user info to the request
    next();  // Proceeds to the next middleware
  } catch (error) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid Token",
        },
      ],
    });
  }
};
