// models/GasSales.ts
import { Schema, model, models } from "mongoose";

const GasSaleSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      default: "",
    },

    cylinderSize: {
      type: String,
      enum: [
        "3kg",
        "5kg",
        "6kg",
        "12.5kg",
        "25kg",
        "50kg",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "Bank Transfer",
        "POS",
      ],
      required: true,
    },

    attendant: {
      type: String,
      required: true,
    },

    cashier: {
      type: String,
      required: true,
    },

    remarks: String,
  },
  {
    timestamps: true,
  }
);


export const GasSale = models.GasSale || model("GasSale", GasSaleSchema)