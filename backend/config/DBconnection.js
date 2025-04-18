const mongoose = require("mongoose");

const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.APP_MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

module.exports = dbconnection;
