import mongoose from "mongoose";

const dbConfig = {
  development: {
    uri: process.env.MONGO_URI_DEV || "mongodb://localhost:27017/",
    dbName: "drink_order_db",
  },
  production: {
    uri: process.env.MONGO_URI,
    dbName: "brewly_db",
  },
};

export const connectDB = async () => {
  try {
    const env = process.env.NODE_ENV || "development";
    const config = dbConfig[env];

    console.log("NODE_ENV:", env);
    console.log("Using DB config:", config);

    if (!config || !config.uri) {
      throw new Error(`MongoDB URI not found for env=${env}`);
    }

    await mongoose.connect(config.uri, {
      dbName: config.dbName,
    });

    console.log(`✅ MongoDB connected to ${config.dbName} (${env})...`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
