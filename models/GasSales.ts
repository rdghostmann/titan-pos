import { Schema, model, models } from 'mongoose';

const GasSaleSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      required: true,
    },

    customerName: String,

    customerPhone: String,

    cylinderSize: {
      type: String,
      enum: ['3kg', '5kg', '6kg', '12.5kg', '25kg', '50kg'],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    pricePerKg: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'POS'],
      required: true,
    },

    attendant: String,

    cashier: String,

    remarks: String,
  },
  { timestamps: true }
);

export const GasSale = models.GasSale || model("GasSale", GasSaleSchema)