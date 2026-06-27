import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { User } from "@/models/User";
import { connectToDB } from "@/lib/connectToDB";

export async function POST() {
  try {
    // Prevent use in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { message: "Seeding is disabled in production." },
        { status: 403 }
      );
    }

    await connectToDB();

    const existing = await User.findOne({
      email: "admin@titanpos.com",
    });

    if (existing) {
      return NextResponse.json({
        message: "Administrator already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
      name: "TitanPOS Administrator",
      username: "admin",
      email: "admin@titanpos.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      message: "Administrator account created successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Unable to seed administrator.",
      },
      {
        status: 500,
      }
    );
  }
}