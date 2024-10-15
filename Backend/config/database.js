const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, // It's a good practice to use this option
    })
    .then(() => {
        console.log("MongoDB connection: success");
    })
    .catch((err) => console.log(err));
};

module.exports = { connectDB };
