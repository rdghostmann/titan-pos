import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        'Groceries',
        'Beverages',
        'Electronics',
        'Cosmetics',
        'Household Items',
        'Stationery',
        'Pharmaceuticals',
        'Services',
      ],
      required: true,
    },

    description: String,

    barcode: String,

    costPrice: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    reorderLevel: {
      type: Number,
      default: 10,
    },

    unitType: String,

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },

    dateAdded: String,

    lastUpdated: String,
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema)