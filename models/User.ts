import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: [
        'Administrator',
        'Cashier',
        'Pump Attendant',
        'Car Wash Attendant',
      ],
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema)