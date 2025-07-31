import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`Connect to mongoDB ${conn.connection.host}`);
  } catch (error) {
    logger.error("Error in connect mongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
