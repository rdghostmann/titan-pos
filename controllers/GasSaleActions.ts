// controllers/GasSale.ts
"use server";

import { connectToDB } from "@/lib/connectToDB";
import { GasSale } from "@/models/GasSale";
import { revalidatePath } from "next/cache";

export interface GasSale {
  _id: string;
  receiptNumber: string;
  date: string; // ISO string (e.g., "2026-06-21T14:45:00Z")
  customerName: string;
  customerPhone: string;
  cylinderSize: '3kg' | '5kg' | '6kg' | '12.5kg' | '25kg' | '50kg';
  quantity: number; // in KG
  pricePerKg: number; // in Naira
  amount: number; // Auto-calculated: quantity * pricePerKg
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS';
  attendant: string;
  cashier: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGasSaleInput {
  customerName: string;
  customerPhone: string;
  cylinderSize:
    | "3kg"
    | "5kg"
    | "6kg"
    | "12.5kg"
    | "25kg"
    | "50kg";

  quantity: number;

  pricePerKg: number;

  paymentMethod:
    | "Cash"
    | "Bank Transfer"
    | "POS";

  attendant: string;

  cashier: string;

  remarks: string;
}


export async function GetGasSales() {
  try {
    await connectToDB();

    const sales = await GasSale.find({})
      .sort({ createdAt: -1, date: -1 });

    return {
      success: true,
      sales: JSON.parse(JSON.stringify(sales)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      sales: [],
      message: "Unable to retrieve Gas Sales.",
    };
  }
}

export async function CreateGasSales(
  data: CreateGasSaleInput
) {
  try {
    await connectToDB();

    const today = new Date();

    const prefix =
      `GAS-${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(
        today.getDate()
      ).padStart(2, "0")}`;

    const count = await GasSale.countDocuments({
      receiptNumber: {
        $regex: `^${prefix}`,
      },
    });

    const receiptNumber =
      `${prefix}-${String(count + 1).padStart(3, "0")}`;

    const amount =
      Number(data.quantity) *
      Number(data.pricePerKg);

    const sale = await GasSale.create({
      receiptNumber,
      date: new Date(),

      customerName: data.customerName,

      customerPhone: data.customerPhone,

      cylinderSize: data.cylinderSize,

      quantity: data.quantity,

      pricePerKg: data.pricePerKg,

      amount,

      paymentMethod: data.paymentMethod,

      attendant: data.attendant,

      cashier: data.cashier,

      remarks: data.remarks,
    });

    revalidatePath("/admin/cooking-gas-plant");

    return {
      success: true,
      sale: JSON.parse(JSON.stringify(sale)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to create sale.",
    };
  }
}


export async function DeleteGasSale(
  id: string
) {
  try {
    await connectToDB();

    await GasSale.findByIdAndDelete(id);

    revalidatePath("/admin/cooking-gas-plant");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
    };
  }
}

