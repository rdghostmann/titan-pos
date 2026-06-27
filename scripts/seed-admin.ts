// scripts/seed-admin.ts
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1) }

// Using the application's `User` model from models/User for seeding.

async function seed() {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const exists = await User.findOne({
        email: "admin@titanpos.com",
    });

    if (exists) {
        console.log("Admin already exists");
        process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
        name: "TitanPOS Administrator",
        username: "admin",
        email: "admin@titanpos.com",
        password: hashedPassword,
        role: "admin", // ✅ lowercase
    });

    console.log(`✅ Admin seeded:`)
    await mongoose.disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
