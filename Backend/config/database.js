const connectDB = () => {
  const mongoose = require("mongoose");
  console.log(process.env.MONGO_URL);
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("connection: success");
    })
    .catch((err) => console.log(err));
};
exports.connectDB = connectDB;
