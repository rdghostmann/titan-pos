// controllers/CarWashActions.ts
"use server";

import { connectToDB } from "@/lib/connectToDB";
import { CarWashSale } from "@/models/CarWashSale";
import { revalidatePath } from "next/cache";

export interface CarWashSale {
  _id: string;

  receiptNumber: string;

  date: string;

  customerName: string;

  customerPhone: string;

  vehicleNumberPlate: string;

  vehicleType:
    | "Sedan"
    | "SUV"
    | "Truck"
    | "Bus"
    | "Motorcycle";

  serviceType:
    | "Exterior Wash"
    | "Interior Wash"
    | "Full Wash"
    | "Engine Wash"
    | "Waxing"
    | "Detailing";

  amount: number;

  paymentMethod:
    | "Cash"
    | "Bank Transfer"
    | "POS";

  attendant: string;

  cashier: string;

  timeIn: string;

  timeOut: string;

  remarks: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateCarWashSaleInput {
  customerName: string;

  customerPhone: string;

  vehicleNumberPlate: string;

  vehicleType:
    | "Sedan"
    | "SUV"
    | "Truck"
    | "Bus"
    | "Motorcycle";

  serviceType:
    | "Exterior Wash"
    | "Interior Wash"
    | "Full Wash"
    | "Engine Wash"
    | "Waxing"
    | "Detailing";

  amount: number;

  paymentMethod:
    | "Cash"
    | "Bank Transfer"
    | "POS";

  attendant: string;

  cashier: string;

  timeIn: string;

  timeOut: string;

  remarks: string;
}

/* ===========================================================
   GET ALL SALES
=========================================================== */

export async function GetCarWashSales() {
  try {
    await connectToDB();

    const sales = await CarWashSale.find({})
      .sort({
        createdAt: -1,
        date: -1,
      });

    return {
      success: true,
      sales: JSON.parse(JSON.stringify(sales)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      sales: [],
      message: "Unable to retrieve Car Wash Sales.",
    };
  }
}

/* ===========================================================
   CREATE SALE
=========================================================== */

export async function CreateCarWashSale(
  data: CreateCarWashSaleInput
) {
  try {
    await connectToDB();

    const today = new Date();

    const prefix =
      `CWS-${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(
        today.getDate()
      ).padStart(2, "0")}`;

    const count =
      await CarWashSale.countDocuments({
        receiptNumber: {
          $regex: `^${prefix}`,
        },
      });

    const receiptNumber =
      `${prefix}-${String(count + 1).padStart(
        3,
        "0"
      )}`;

    const sale = await CarWashSale.create({
      receiptNumber,

      date: new Date(),

      customerName: data.customerName,

      customerPhone: data.customerPhone,

      vehicleNumberPlate:
        data.vehicleNumberPlate,

      vehicleType: data.vehicleType,

      serviceType: data.serviceType,

      amount: Number(data.amount),

      paymentMethod:
        data.paymentMethod,

      attendant: data.attendant,

      cashier: data.cashier,

      timeIn: data.timeIn,

      timeOut: data.timeOut,

      remarks: data.remarks,
    });

    revalidatePath("/admin/car-wash");

    return {
      success: true,
      sale: JSON.parse(JSON.stringify(sale)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Unable to create Car Wash Sale.",
    };
  }
}

/* ===========================================================
   DELETE SALE
=========================================================== */

export async function DeleteCarWashSale(
  id: string
) {
  try {
    await connectToDB();

    await CarWashSale.findByIdAndDelete(id);

    revalidatePath("/admin/car-wash");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Unable to delete Car Wash Sale.",
    };
  }
}