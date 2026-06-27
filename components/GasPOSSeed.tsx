// GasPOSSeed.tsx

import { GasSale } from "@/types";
import { GAS_RETAIL_PRICE_PER_KG } from "@/mockData";

export const STATIC_GAS_SALES: GasSale[] = [
  {
    _id: "gas-1",
    receiptNumber: "GAS-20260621-001",
    date: "2026-06-21T10:15:00.000Z",
    customerName: "Kemi Adebayo",
    customerPhone: "+2348012345678",
    cylinderSize: "12.5kg",
    quantity: 12.5,
    pricePerKg: GAS_RETAIL_PRICE_PER_KG,
    amount: 125000,
    paymentMethod: "Cash",
    attendant: "Amina Yusuf",
    cashier: "Tunde Bassey",
    remarks: "Delivered within 20 mins",
  },
  {
    _id: "gas-2",
    receiptNumber: "GAS-20260621-002",
    date: "2026-06-21T11:40:00.000Z",
    customerName: "Ibrahim Musa",
    customerPhone: "+2348098765432",
    cylinderSize: "6kg",
    quantity: 6,
    pricePerKg: GAS_RETAIL_PRICE_PER_KG,
    amount: 72000,
    paymentMethod: "POS",
    attendant: "Bola Okafor",
    cashier: "Grace Eze",
    remarks: "Customer requested fast refill",
  },
  {
    id: "gas-3",
    receiptNumber: "GAS-20260621-003",
    date: "2026-06-21T13:05:00.000Z",
    customerName: "Ngozi Chukwu",
    customerPhone: "+2347055544433",
    cylinderSize: "25kg",
    quantity: 25,
    pricePerKg: GAS_RETAIL_PRICE_PER_KG,
    amount: 250000,
    paymentMethod: "Bank Transfer",
    attendant: "Amina Yusuf",
    cashier: "Tunde Bassey",
    remarks: "Advance payment received",
  },
];