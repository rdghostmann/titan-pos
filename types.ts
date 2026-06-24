export type UserRole = 'Administrator' | 'Cashier' | 'Pump Attendant' | 'Car Wash Attendant';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
}

export interface GasSale {
  id: string;
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
}

export interface CarWashSale {
  id: string;
  receiptNumber: string;
  date: string; // ISO string
  customerName: string;
  customerPhone: string;
  vehicleNumberPlate: string;
  vehicleType: 'Sedan' | 'SUV' | 'Truck' | 'Bus' | 'Motorcycle';
  serviceType: 'Exterior Wash' | 'Interior Wash' | 'Full Wash' | 'Engine Wash' | 'Waxing' | 'Detailing';
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS';
  attendant: string;
  cashier: string;
  timeIn: string; // "HH:MM"
  timeOut: string; // "HH:MM"
  remarks: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Groceries' | 'Beverages' | 'Electronics' | 'Cosmetics' | 'Household Items' | 'Stationery' | 'Pharmaceuticals' | 'Services';
  description: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  unitType: string; // e.g. 'Pcs', 'Pack', 'Carton', 'Kg', 'Bottle'
  status: 'Active' | 'Inactive';
  dateAdded: string;
  lastUpdated: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  prevQuantity: number;
  newQuantity: number;
  quantityChanged: number;
  actionType: 'Addition' | 'Reduction' | 'Adjustment' | 'Bulk Addition' | 'Creation';
  adminName: string;
  date: string;
}

export interface SalesItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface GeneralSale {
  id: string;
  receiptNumber: string; // GS-000001, etc.
  items: SalesItem[];
  totalQuantity: number;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  cashReceived: number;
  balanceReturned: number;
  cashierName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface DashboardStats {
  totalRevenue: number;
  gasRevenue: number;
  carWashRevenue: number;
  totalTransactions: number;
  activeStaffCount: number;
  totalCustomersCount: number;
}

