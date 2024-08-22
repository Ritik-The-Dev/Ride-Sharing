const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDb Connected Successfully"))
    .catch((err) => {
      console.log("Error Connecting Database ", err);
      process.exit(1);
    });
};

module.exports = { connectDb };
