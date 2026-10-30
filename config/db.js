import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("<username>")) {
    console.error(
      "❌ MONGO_URI missing or placeholder in .env — apni MongoDB Atlas connection string daalein: mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority"
    );
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
