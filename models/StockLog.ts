import { Schema, model, models } from 'mongoose';

const StockLogSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    productName: String,

    prevQuantity: Number,

    newQuantity: Number,

    quantityChanged: Number,

    actionType: {
      type: String,
      enum: [
        'Addition',
        'Reduction',
        'Adjustment',
        'Bulk Addition',
        'Creation',
      ],
      required: true,
    },

    adminName: String,

    date: String,
  },
  { timestamps: true }
);

export const StockLog = models.StockLog || model("StockLog", StockLogSchema)