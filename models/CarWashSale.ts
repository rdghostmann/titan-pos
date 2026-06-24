import { Schema, model, models } from 'mongoose';

const CarWashSaleSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    customerName: String,

    customerPhone: String,

    vehicleNumberPlate: String,

    vehicleType: {
      type: String,
      enum: [
        'Sedan',
        'SUV',
        'Truck',
        'Bus',
        'Motorcycle',
      ],
      required: true,
    },

    serviceType: {
      type: String,
      enum: [
        'Exterior Wash',
        'Interior Wash',
        'Full Wash',
        'Engine Wash',
        'Waxing',
        'Detailing',
      ],
      required: true,
    },

    amount: Number,

    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'POS'],
      required: true,
    },

    attendant: String,

    cashier: String,

    timeIn: String,

    timeOut: String,

    remarks: String,
  },
  { timestamps: true }
);

export const CarWashSale = models.CarWashSale || model("CarWashSale", CarWashSaleSchema);