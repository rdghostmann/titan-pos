// controllers/CreateUserStaff.ts
"use server";

import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { hash } from "bcryptjs";

export interface CreateUserStaffInput {
  name: string;
  role: "admin" | "cashier";
}

export interface UserStaffRecord {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "cashier";
  createdAt: string;
}

export interface CreateUserStaffOutput {
  success: boolean;
  message: string;
  user?: UserStaffRecord;
}

export interface GetUserStaffOutput {
  success: boolean;
  message: string;
  users: UserStaffRecord[];
}

export interface DeleteUserStaffOutput {
  success: boolean;
  message: string;
}

/**
 * Generate username from first name + 4 random digits
 * @param fullName - The staff's full name
 * @returns Generated username (e.g., "babatunde2847")
 */
function generateUsername(fullName: string): string {
  const firstName = fullName.trim().split(" ")[0].toLowerCase();
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${firstName}${randomDigits}`;
}

/**
 * Create a new staff user account in the system
 * Default password: "cashier123"
 * Email: {generated_username}@titanpos.com
 */
export async function CreateUserStaff(
  input: CreateUserStaffInput
): Promise<CreateUserStaffOutput> {
  try {
    await connectToDB();

    // Validate input
    if (!input.name || !input.name.trim()) {
      return {
        success: false,
        message: "Staff name is required.",
      };
    }

    if (!["admin", "cashier"].includes(input.role)) {
      return {
        success: false,
        message: "Invalid role. Must be 'admin' or 'cashier'.",
      };
    }

    // Generate username from first name + random 4 digits
    const username = generateUsername(input.name);

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return {
        success: false,
        message: `Username "${username}" already exists. Please try again.`,
      };
    }

    // Generate email from username
    const email = `${username}@titanpos.com`;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        message: `Email "${email}" already registered in the system.`,
      };
    }

    // Hash the default password
    const defaultPassword = "cashier123";
    const hashedPassword = await hash(defaultPassword, 10);

    // Create the new user
    const newUser = await User.create({
      name: input.name.trim(),
      username,
      email,
      password: hashedPassword,
      role: input.role,
    });

    // Convert to plain object and exclude sensitive data
    const userRecord = JSON.parse(JSON.stringify(newUser));
    delete userRecord.password;

    return {
      success: true,
      message: `Staff account created successfully for ${input.name}. Username: ${username}, Email: ${email}`,
      user: {
        _id: userRecord._id,
        name: userRecord.name,
        username: userRecord.username,
        email: userRecord.email,
        role: userRecord.role,
        createdAt: userRecord.createdAt,
      },
    };
  } catch (error) {
    console.error("Error creating staff user:", error);
    return {
      success: false,
      message: "Unable to create staff account. Please try again.",
    };
  }
}

/**
 * Retrieve all staff user accounts from the system
 */
export async function GetUserStaff(): Promise<GetUserStaffOutput> {
  try {
    await connectToDB();

    const users = await User.find({}).sort({ createdAt: -1 });

    const staffList: UserStaffRecord[] = users.map((user) => {
      const userObj = JSON.parse(JSON.stringify(user));
      return {
        _id: userObj._id,
        name: userObj.name,
        username: userObj.username,
        email: userObj.email,
        role: userObj.role,
        createdAt: userObj.createdAt,
      };
    });

    return {
      success: true,
      message: `Retrieved ${staffList.length} staff account(s).`,
      users: staffList,
    };
  } catch (error) {
    console.error("Error retrieving staff users:", error);
    return {
      success: false,
      message: "Unable to retrieve staff accounts. Please try again.",
      users: [],
    };
  }
}

/**
 * Delete a staff user account by ID
 */
export async function DeleteUserStaff(
  userId: string
): Promise<DeleteUserStaffOutput> {
  try {
    await connectToDB();

    if (!userId || !userId.trim()) {
      return {
        success: false,
        message: "User ID is required.",
      };
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return {
        success: false,
        message: "Staff account not found.",
      };
    }

    return {
      success: true,
      message: `Staff account for ${user.name} has been deleted.`,
    };
  } catch (error) {
    console.error("Error deleting staff user:", error);
    return {
      success: false,
      message: "Unable to delete staff account. Please try again.",
    };
  }
}
