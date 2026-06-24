import { Schema, model, models } from 'mongoose';

const SalesItemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    price: Number,

    quantity: Number,

    total: Number,
  },
  {
    _id: false,
  }
);

const GeneralSaleSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    items: [SalesItemSchema],

    totalQuantity: Number,

    subtotal: Number,

    discount: Number,

    tax: Number,

    grandTotal: Number,

    cashReceived: Number,

    balanceReturned: Number,

    cashierName: String,

    date: String,

    time: String,
  },
  { timestamps: true }
);

export const GeneralSale = models.GeneralSale || model("GeneralSale", GeneralSaleSchema)