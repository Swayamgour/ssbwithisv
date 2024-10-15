const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {
  const token = req.header("token");

  // const { authorization } = req.headers;
  console.log(token);
  // console.log(authorization);
  // CHECK IF WE EVEN HAVE A TOKEN
  if (!token) {
    res.status(401).json({
      errors: [
        {
          msg: "No token found",
        },
      ],
    });
  }

  try {
    const token2=token.split(" ")[1];
    console.log(token2);
    const user = await jwt.verify(token2, process.env.JWT_SECRET);
    req.user = user.email;
    next();
  } catch (error) {
    res.status(400).json({
      errors: [
        {
          msg: "Invalid Token",
        },
      ],
    });
  }
};

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   //authorization === Bearer token
//   //401 means unotherized
//   if (!authorization) {
//     return res.status(401).json({ error: "you must be login" });
//   }
//   const token = authorization.replace("Bearer ", "");
//   jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
//     if (err) {
//       return res.status(401).json({ error: "you must be logged in" });
//     }
//     const { _id } = payload;
//     User.findById(_id).then((userdata) => {
//       req.user = userdata; //req.user container all the data of user
//       next();
//     });
//   });
// };
