// Seed script: `npm run seed`
// Product collection me starting data (frontend static arrays wala) daal deta hai
// aur ek default Admin account bana deta hai (.env ke ADMIN_EMAIL / ADMIN_PASSWORD se).

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";
import { seedProducts } from "./products.js";

dotenv.config();

async function seed() {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("<username>")) {
      console.error(
        "❌ .env me sahi MONGO_URI daalein (Atlas URI with real user/pass/dbname)"
      );
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clean start
    await Product.deleteMany({});
    await Admin.deleteMany({});

    const products = await Product.insertMany(seedProducts);
    console.log(`✅ ${products.length} products seeded:`);
    products.forEach((p) => console.log(`   - ${p.title} ($${p.price})`));

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const admin = await Admin.create({
      name: "Admin",
      email: adminEmail.toLowerCase(),
      password: adminPassword,
    });

    console.log("✅ Admin created:");
    console.log(`   email: ${admin.email}`);
    console.log(`   password: ${adminPassword}`);

    await mongoose.disconnect();
    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
