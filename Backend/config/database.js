const mongoose = require("mongoose");

const connectDB = async () => {
  // Check if the MONGO_URL is defined
  if (!process.env.MONGO_URL) {
    console.error("MongoDB connection string is not defined in environment variables.");
    process.exit(1); // Exit the process with failure
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // New connection management engine
      useCreateIndex: true, // Use createIndex() instead of ensureIndex()
    });
    console.log("MongoDB connection: success");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = { connectDB };
