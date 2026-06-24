import { User, GasSale, CarWashSale, Product, GeneralSale, StockLog } from './types';

// Predefined Users
export const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Alhaji Ibrahim', role: 'Administrator', username: 'admin' },
  { id: 'u2', name: 'Precious Okon', role: 'Cashier', username: 'precious' },
  { id: 'u3', name: 'Fatima Umar', role: 'Cashier', username: 'fatima' },
  { id: 'u4', name: 'Adeyemi Johnson', role: 'Pump Attendant', username: 'adeyemi' },
  { id: 'u5', name: 'Chidi Obi', role: 'Pump Attendant', username: 'chidi' },
  { id: 'u6', name: 'Musa Bello', role: 'Pump Attendant', username: 'musa' },
  { id: 'u7', name: 'Blessing Ekong', role: 'Car Wash Attendant', username: 'blessing' },
  { id: 'u8', name: 'Tunde Bakare', role: 'Car Wash Attendant', username: 'tunde' },
  { id: 'u9', name: 'Umar Farouq', role: 'Car Wash Attendant', username: 'umar' },
];

export const ATTENDANTS_GAS = ['Adeyemi Johnson', 'Chidi Obi', 'Musa Bello'];
export const ATTENDANTS_CARWASH = ['Blessing Ekong', 'Tunde Bakare', 'Umar Farouq'];
export const CASHIERS = ['Precious Okon', 'Fatima Umar'];

// Base Prices mapping
export const GAS_RETAIL_PRICE_PER_KG = 1200; // Naira

export const CARWASH_PRICING: Record<string, Record<string, number>> = {
  Sedan: {
    'Exterior Wash': 1500,
    'Interior Wash': 1500,
    'Full Wash': 2500,
    'Engine Wash': 1800,
    'Waxing': 4000,
    'Detailing': 10000,
  },
  SUV: {
    'Exterior Wash': 2000,
    'Interior Wash': 2000,
    'Full Wash': 3500,
    'Engine Wash': 2200,
    'Waxing': 5000,
    'Detailing': 15000,
  },
  Truck: {
    'Exterior Wash': 3000,
    'Interior Wash': 3000,
    'Full Wash': 5000,
    'Engine Wash': 3500,
    'Waxing': 8000,
    'Detailing': 20000,
  },
  Bus: {
    'Exterior Wash': 3500,
    'Interior Wash': 3000,
    'Full Wash': 6000,
    'Engine Wash': 4000,
    'Waxing': 10000,
    'Detailing': 25000,
  },
  Motorcycle: {
    'Exterior Wash': 8000, // wait, cheap wash
    'Interior Wash': 500,
    'Full Wash': 1200,
    'Engine Wash': 1000,
    'Waxing': 2500,
    'Detailing': 5000,
  },
};

// Quick fix for Motorcycle exterior price, should be like 1000
CARWASH_PRICING.Motorcycle['Exterior Wash'] = 800;

// Helper to generate dates across the last 30 days relative to 2026-06-21
function createPastDateString(daysAgo: number, hour: number, minute: number): string {
  const baseDate = new Date('2026-06-21T14:45:00');
  baseDate.setDate(baseDate.getDate() - daysAgo);
  baseDate.setHours(hour, minute, 0, 0);
  return baseDate.toISOString();
}

// Generate ~25 Gas Sales across the last 30 days
export const SEED_GAS_SALES: GasSale[] = [
  {
    id: 'g1',
    receiptNumber: 'GAS-20260621-001',
    date: createPastDateString(0, 9, 15),
    customerName: 'Emeka Nwosu',
    customerPhone: '+2348031112222',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Adeyemi Johnson',
    cashier: 'Precious Okon',
    remarks: 'Standard fill',
  },
  {
    id: 'g2',
    receiptNumber: 'GAS-20260621-002',
    date: createPastDateString(0, 11, 40),
    customerName: 'Amina Yusuf',
    customerPhone: '+2348123456789',
    cylinderSize: '6kg',
    quantity: 6,
    pricePerKg: 1200,
    amount: 7200,
    paymentMethod: 'Cash',
    attendant: 'Chidi Obi',
    cashier: 'Fatima Umar',
    remarks: '',
  },
  {
    id: 'g3',
    receiptNumber: 'GAS-20260620-001',
    date: createPastDateString(1, 14, 20),
    customerName: 'Kunle Ajayi',
    customerPhone: '+2347055566677',
    cylinderSize: '25kg',
    quantity: 25,
    pricePerKg: 1200,
    amount: 30000,
    paymentMethod: 'POS',
    attendant: 'Musa Bello',
    cashier: 'Precious Okon',
    remarks: 'Customer brought steel cylinder',
  },
  {
    id: 'g4',
    receiptNumber: 'GAS-20260620-002',
    date: createPastDateString(1, 16, 55),
    customerName: 'Nkechi Okafor',
    customerPhone: '+2349088889999',
    cylinderSize: '50kg',
    quantity: 50,
    pricePerKg: 1200,
    amount: 60000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Adeyemi Johnson',
    cashier: 'Precious Okon',
    remarks: 'Hotel catering order',
  },
  {
    id: 'g5',
    receiptNumber: 'GAS-20260619-001',
    date: createPastDateString(2, 10, 5),
    customerName: 'Chioma Obi',
    customerPhone: '+2348022223333',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'Cash',
    attendant: 'Chidi Obi',
    cashier: 'Fatima Umar',
    remarks: '',
  },
  {
    id: 'g6',
    receiptNumber: 'GAS-20260618-001',
    date: createPastDateString(3, 11, 30),
    customerName: 'Babajide Sanwo',
    customerPhone: '+2348055543210',
    cylinderSize: '3kg',
    quantity: 3,
    pricePerKg: 1200,
    amount: 3600,
    paymentMethod: 'Cash',
    attendant: 'Musa Bello',
    cashier: 'Precious Okon',
    remarks: 'Camp gas size',
  },
  {
    id: 'g7',
    receiptNumber: 'GAS-20260617-001',
    date: createPastDateString(4, 15, 12),
    customerName: 'Abubakar Danladi',
    customerPhone: '+2348099991111',
    cylinderSize: '50kg',
    quantity: 50,
    pricePerKg: 1200,
    amount: 60000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Adeyemi Johnson',
    cashier: 'Fatima Umar',
    remarks: 'Commercial laundry',
  },
  {
    id: 'g8',
    receiptNumber: 'GAS-20260616-001',
    date: createPastDateString(5, 12, 45),
    customerName: 'Yusuf Mohammed',
    customerPhone: '+2348123335555',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'POS',
    attendant: 'Chidi Obi',
    cashier: 'Precious Okon',
    remarks: '',
  },
  {
    id: 'g9',
    receiptNumber: 'GAS-20260615-001',
    date: createPastDateString(6, 17, 10),
    customerName: 'Seyi Makinde',
    customerPhone: '+2348066667777',
    cylinderSize: '6kg',
    quantity: 6,
    pricePerKg: 1200,
    amount: 7200,
    paymentMethod: 'Bank Transfer',
    attendant: 'Musa Bello',
    cashier: 'Precious Okon',
    remarks: '',
  },
  {
    id: 'g10',
    receiptNumber: 'GAS-20260614-001',
    date: createPastDateString(7, 10, 20),
    customerName: 'Bosede Alao',
    customerPhone: '+2349077778888',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'Cash',
    attendant: 'Adeyemi Johnson',
    cashier: 'Fatima Umar',
    remarks: '',
  },
  {
    id: 'g11',
    receiptNumber: 'GAS-20260612-001',
    date: createPastDateString(9, 13, 15),
    customerName: 'Tosin Cole',
    customerPhone: '+2348055556666',
    cylinderSize: '25kg',
    quantity: 25,
    pricePerKg: 1200,
    amount: 30000,
    paymentMethod: 'POS',
    attendant: 'Chidi Obi',
    cashier: 'Precious Okon',
    remarks: '',
  },
  {
    id: 'g12',
    receiptNumber: 'GAS-20260610-001',
    date: createPastDateString(11, 15, 40),
    customerName: 'Chima Ugwu',
    customerPhone: '+2348044445555',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'Cash',
    attendant: 'Musa Bello',
    cashier: 'Fatima Umar',
    remarks: '',
  },
  {
    id: 'g13',
    receiptNumber: 'GAS-20260608-001',
    date: createPastDateString(13, 11, 10),
    customerName: 'Nuhu Ribadu',
    customerPhone: '+2348011110000',
    cylinderSize: '50kg',
    quantity: 50,
    pricePerKg: 1200,
    amount: 60000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Adeyemi Johnson',
    cashier: 'Precious Okon',
    remarks: 'Industrial kitchen',
  },
  {
    id: 'g14',
    receiptNumber: 'GAS-20260605-001',
    date: createPastDateString(16, 16, 50),
    customerName: 'Patience Jonathan',
    customerPhone: '+2348033333333',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'Cash',
    attendant: 'Chidi Obi',
    cashier: 'Fatima Umar',
    remarks: 'Fast fill',
  },
  {
    id: 'g15',
    receiptNumber: 'GAS-20260601-001',
    date: createPastDateString(20, 10, 30),
    customerName: 'Goodluck Ebele',
    customerPhone: '+2348077777777',
    cylinderSize: '25kg',
    quantity: 25,
    pricePerKg: 1200,
    amount: 30000,
    paymentMethod: 'POS',
    attendant: 'Musa Bello',
    cashier: 'Precious Okon',
    remarks: '',
  },
  {
    id: 'g16',
    receiptNumber: 'GAS-20260528-001',
    date: createPastDateString(24, 14, 15),
    customerName: 'Umaru YarAdua',
    customerPhone: '+2348088888888',
    cylinderSize: '6kg',
    quantity: 6,
    pricePerKg: 1200,
    amount: 7200,
    paymentMethod: 'Cash',
    attendant: 'Adeyemi Johnson',
    cashier: 'Fatima Umar',
    remarks: '',
  },
  {
    id: 'g17',
    receiptNumber: 'GAS-20260525-001',
    date: createPastDateString(27, 16, 0),
    customerName: 'Olusegun Aremu',
    customerPhone: '+2348099999999',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: 1200,
    amount: 15000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Chidi Obi',
    cashier: 'Precious Okon',
    remarks: '',
  }
];

// Generate ~20 Car Wash Sales across the last 30 days
export const SEED_CAR_WASH_SALES: CarWashSale[] = [
  {
    id: 'c1',
    receiptNumber: 'CW-20260621-001',
    date: createPastDateString(0, 8, 30),
    customerName: 'Chief Okeke',
    customerPhone: '+2348051234567',
    vehicleNumberPlate: 'LND-123AA',
    vehicleType: 'SUV',
    serviceType: 'Full Wash',
    amount: 3500,
    paymentMethod: 'Cash',
    attendant: 'Tunde Bakare',
    cashier: 'Precious Okon',
    timeIn: '08:30',
    timeOut: '09:15',
    remarks: 'Muddy SUV from return trip',
  },
  {
    id: 'c2',
    receiptNumber: 'CW-20260621-002',
    date: createPastDateString(0, 10, 15),
    customerName: 'Dele Momodu',
    customerPhone: '+2348033004400',
    vehicleNumberPlate: 'IKY-999ZZ',
    vehicleType: 'Sedan',
    serviceType: 'Detailing',
    amount: 10000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Blessing Ekong',
    cashier: 'Precious Okon',
    timeIn: '10:15',
    timeOut: '12:30',
    remarks: 'Deep cleaning interior and exterior leather conditioning',
  },
  {
    id: 'c3',
    receiptNumber: 'CW-20260620-001',
    date: createPastDateString(1, 11, 45),
    customerName: 'Funmi Alao',
    customerPhone: '+2347034345656',
    vehicleNumberPlate: 'KJA-456BB',
    vehicleType: 'Sedan',
    serviceType: 'Exterior Wash',
    amount: 1500,
    paymentMethod: 'POS',
    attendant: 'Umar Farouq',
    cashier: 'Fatima Umar',
    timeIn: '11:45',
    timeOut: '12:10',
    remarks: 'Quick dusty wash',
  },
  {
    id: 'c4',
    receiptNumber: 'CW-20260620-002',
    date: createPastDateString(1, 15, 30),
    customerName: 'Idris Elba',
    customerPhone: '+2348123234545',
    vehicleNumberPlate: 'APP-789CC',
    vehicleType: 'Truck',
    serviceType: 'Engine Wash',
    amount: 3500,
    paymentMethod: 'Bank Transfer',
    attendant: 'Tunde Bakare',
    cashier: 'Fatima Umar',
    timeIn: '15:30',
    timeOut: '16:15',
    remarks: 'Heavy oil stains on engine bay',
  },
  {
    id: 'c5',
    receiptNumber: 'CW-20260619-001',
    date: createPastDateString(2, 9, 0),
    customerName: 'Wole Soyinka',
    customerPhone: '+2348056789012',
    vehicleNumberPlate: 'ABJ-321WS',
    vehicleType: 'Sedan',
    serviceType: 'Waxing',
    amount: 4000,
    paymentMethod: 'Cash',
    attendant: 'Blessing Ekong',
    cashier: 'Precious Okon',
    timeIn: '09:00',
    timeOut: '10:45',
    remarks: 'Premium clay bar and hand wax',
  },
  {
    id: 'c6',
    receiptNumber: 'CW-20260618-001',
    date: createPastDateString(3, 14, 0),
    customerName: 'Chimamanda Adichie',
    customerPhone: '+2348166778899',
    vehicleNumberPlate: 'ENU-555CA',
    vehicleType: 'SUV',
    serviceType: 'Full Wash',
    amount: 3500,
    paymentMethod: 'POS',
    attendant: 'Umar Farouq',
    cashier: 'Fatima Umar',
    timeIn: '14:00',
    timeOut: '14:50',
    remarks: '',
  },
  {
    id: 'c7',
    receiptNumber: 'CW-20260617-001',
    date: createPastDateString(4, 11, 0),
    customerName: 'Wizkid Balogun',
    customerPhone: '+2348022114433',
    vehicleNumberPlate: 'LND-001STAR',
    vehicleType: 'SUV',
    serviceType: 'Detailing',
    amount: 15000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Tunde Bakare',
    cashier: 'Precious Okon',
    timeIn: '11:00',
    timeOut: '14:00',
    remarks: 'Matte paint treatment. Delicate care.',
  },
  {
    id: 'c8',
    receiptNumber: 'CW-20260615-001',
    date: createPastDateString(6, 16, 20),
    customerName: 'Davido Adeleke',
    customerPhone: '+2348030303030',
    vehicleNumberPlate: 'OBO-030DMG',
    vehicleType: 'Bus',
    serviceType: 'Full Wash',
    amount: 6000,
    paymentMethod: 'POS',
    attendant: 'Blessing Ekong',
    cashier: 'Precious Okon',
    timeIn: '16:20',
    timeOut: '17:30',
    remarks: 'Tour bus wash services',
  },
  {
    id: 'c9',
    receiptNumber: 'CW-20260614-001',
    date: createPastDateString(7, 10, 0),
    customerName: 'Burna Ogulu',
    customerPhone: '+2348177553311',
    vehicleNumberPlate: 'PHC-777ODG',
    vehicleType: 'SUV',
    serviceType: 'Waxing',
    amount: 5000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Umar Farouq',
    cashier: 'Fatima Umar',
    timeIn: '10:00',
    timeOut: '11:30',
    remarks: 'Clay treatment and polishing',
  },
  {
    id: 'c10',
    receiptNumber: 'CW-20260612-001',
    date: createPastDateString(9, 13, 10),
    customerName: 'Genevieve Nnaji',
    customerPhone: '+2348055660099',
    vehicleNumberPlate: 'KJA-101GN',
    vehicleType: 'Sedan',
    serviceType: 'Interior Wash',
    amount: 1500,
    paymentMethod: 'Cash',
    attendant: 'Tunde Bakare',
    cashier: 'Precious Okon',
    timeIn: '13:10',
    timeOut: '13:40',
    remarks: 'Vacuum and dashboard styling',
  },
  {
    id: 'c11',
    receiptNumber: 'CW-20260610-001',
    date: createPastDateString(11, 10, 40),
    customerName: 'Don Jazzy',
    customerPhone: '+2348033221199',
    vehicleNumberPlate: 'SMD-001MVD',
    vehicleType: 'SUV',
    serviceType: 'Engine Wash',
    amount: 2200,
    paymentMethod: 'POS',
    attendant: 'Blessing Ekong',
    cashier: 'Fatima Umar',
    timeIn: '10:40',
    timeOut: '11:15',
    remarks: 'Spark plugs protected from moisture',
  },
  {
    id: 'c12',
    receiptNumber: 'CW-20260608-001',
    date: createPastDateString(13, 15, 0),
    customerName: 'Tiwa Savage',
    customerPhone: '+2347065432109',
    vehicleNumberPlate: 'LND-456TS',
    vehicleType: 'Sedan',
    serviceType: 'Full Wash',
    amount: 2500,
    paymentMethod: 'Bank Transfer',
    attendant: 'Umar Farouq',
    cashier: 'Precious Okon',
    timeIn: '15:00',
    timeOut: '15:45',
    remarks: 'Air freshener added',
  },
  {
    id: 'c13',
    receiptNumber: 'CW-20260604-001',
    date: createPastDateString(17, 12, 10),
    customerName: 'Efe Grace',
    customerPhone: '+2348034567890',
    vehicleNumberPlate: 'ENU-234EF',
    vehicleType: 'Motorcycle',
    serviceType: 'Exterior Wash',
    amount: 800,
    paymentMethod: 'Cash',
    attendant: 'Tunde Bakare',
    cashier: 'Fatima Umar',
    timeIn: '12:10',
    timeOut: '12:30',
    remarks: 'Okada power wash',
  },
  {
    id: 'c14',
    receiptNumber: 'CW-20260601-001',
    date: createPastDateString(20, 14, 30),
    customerName: 'Kanayo O. Kanayo',
    customerPhone: '+2348023456789',
    vehicleNumberPlate: 'KJA-666SAC',
    vehicleType: 'SUV',
    serviceType: 'Full Wash',
    amount: 3500,
    paymentMethod: 'Cash',
    attendant: 'Blessing Ekong',
    cashier: 'Precious Okon',
    timeIn: '14:30',
    timeOut: '15:15',
    remarks: 'Wash with blood donation campaign sticker untouched',
  }
];

// Helper functions for Database interactions
export function getSavedGasSales(): GasSale[] {
  const existing = localStorage.getItem('gas_sales');
  if (!existing) {
    localStorage.setItem('gas_sales', JSON.stringify(SEED_GAS_SALES));
    return SEED_GAS_SALES;
  }
  return JSON.parse(existing);
}

export function saveGasSales(sales: GasSale[]) {
  localStorage.setItem('gas_sales', JSON.stringify(sales));
}

export function getSavedCarWashSales(): CarWashSale[] {
  const existing = localStorage.getItem('car_wash_sales');
  if (!existing) {
    localStorage.setItem('car_wash_sales', JSON.stringify(SEED_CAR_WASH_SALES));
    return SEED_CAR_WASH_SALES;
  }
  return JSON.parse(existing);
}

export function saveCarWashSales(sales: CarWashSale[]) {
  localStorage.setItem('car_wash_sales', JSON.stringify(sales));
}

export function getSavedUsers(): User[] {
  const existing = localStorage.getItem('pos_users');
  if (!existing) {
    localStorage.setItem('pos_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(existing);
}

export function saveUsers(users: User[]) {
  localStorage.setItem('pos_users', JSON.stringify(users));
}

export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==========================================
// GENERAL RETAIL SALES AND INVENTORY SEEDS
// ==========================================

export const SEED_PRODUCTS: Product[] = [
  // Groceries (12 items)
  {
    id: 'p1',
    name: 'Dangote Long Grain Rice 50kg',
    category: 'Groceries',
    description: 'High-quality stone-free refined Nigerian parboiled rice.',
    barcode: '5901234123451',
    costPrice: 72000,
    sellingPrice: 85000,
    quantity: 15,
    reorderLevel: 5,
    unitType: 'Bag',
    status: 'Active',
    dateAdded: '2026-06-01T08:00:00Z',
    lastUpdated: '2026-06-20T10:00:00Z'
  },
  {
    id: 'p2',
    name: 'Dangote Long Grain Rice 25kg',
    category: 'Groceries',
    description: 'Premium parboiled long grain rice in 25kg packaging.',
    barcode: '5901234123452',
    costPrice: 38000,
    sellingPrice: 45000,
    quantity: 6, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Bag',
    status: 'Active',
    dateAdded: '2026-06-01T08:15:00Z',
    lastUpdated: '2026-06-21T11:00:00Z'
  },
  {
    id: 'p3',
    name: 'Indomie Instant Noodles Onion Carton',
    category: 'Groceries',
    description: 'Carton of Indomie onion chicken flavor noodles containing 40 packs of 70g.',
    barcode: '5901234123453',
    costPrice: 6500,
    sellingPrice: 7800,
    quantity: 35,
    reorderLevel: 10,
    unitType: 'Carton',
    status: 'Active',
    dateAdded: '2026-06-01T09:00:00Z',
    lastUpdated: '2026-06-19T14:40:00Z'
  },
  {
    id: 'p4',
    name: 'Dangote Refined Fine Granulated Sugar 1kg',
    category: 'Groceries',
    description: '100% pure premium white sugar.',
    barcode: '5901234123454',
    costPrice: 1800,
    sellingPrice: 2200,
    quantity: 4, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-02T10:00:00Z',
    lastUpdated: '2026-06-18T16:30:00Z'
  },
  {
    id: 'p5',
    name: 'Devon King\'s Pure Vegetable Oil 5L',
    category: 'Groceries',
    description: 'Premium quality double-fractionated vegetable oil for healthy cooking.',
    barcode: '5901234123455',
    costPrice: 10500,
    sellingPrice: 12500,
    quantity: 18,
    reorderLevel: 5,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-02T10:30:00Z',
    lastUpdated: '2026-06-21T09:12:00Z'
  },
  {
    id: 'p6',
    name: 'Gino Peperoni Tomato Paste Carton',
    category: 'Groceries',
    description: 'Carton of premium rich pepper tomato paste sachet bundles.',
    barcode: '5901234123456',
    costPrice: 5500,
    sellingPrice: 6800,
    quantity: 14,
    reorderLevel: 5,
    unitType: 'Carton',
    status: 'Active',
    dateAdded: '2026-06-03T11:00:00Z',
    lastUpdated: '2026-06-19T12:00:00Z'
  },
  {
    id: 'p7',
    name: 'Honeywell Spaghetti 500g',
    category: 'Groceries',
    description: 'Enriched non-sticky durum wheat semolina pasta.',
    barcode: '5901234123457',
    costPrice: 800,
    sellingPrice: 1000,
    quantity: 120,
    reorderLevel: 25,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-03T11:30:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'p8',
    name: 'Nestlé Golden Morn Cereal 500g',
    category: 'Groceries',
    description: 'Nutritious family cereal made from whole grain maize and soya.',
    barcode: '5901234123458',
    costPrice: 2200,
    sellingPrice: 2700,
    quantity: 2, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-04T12:15:00Z',
    lastUpdated: '2026-06-15T15:00:00Z'
  },
  {
    id: 'p9',
    name: 'Nasco Corn Flakes Original 500g',
    category: 'Groceries',
    description: 'Crispy toasted golden flakes of corn.',
    barcode: '5901234123459',
    costPrice: 3000,
    sellingPrice: 3600,
    quantity: 11,
    reorderLevel: 5,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-04T14:00:00Z',
    lastUpdated: '2026-06-21T17:10:00Z'
  },
  {
    id: 'p10',
    name: 'Dangote Iodized Salt 1kg',
    category: 'Groceries',
    description: 'Refined culinary iodized salt for tasty food.',
    barcode: '5901234123460',
    costPrice: 400,
    sellingPrice: 605,
    quantity: 40,
    reorderLevel: 10,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-05T09:00:00Z',
    lastUpdated: '2026-06-21T18:00:00Z'
  },
  {
    id: 'p11',
    name: 'Butterfield Premium Sliced Bread',
    category: 'Groceries',
    description: 'Ever-fresh sweetened milk sliced white bread loaf.',
    barcode: '5901234123461',
    costPrice: 1100,
    sellingPrice: 1400,
    quantity: 24,
    reorderLevel: 12,
    unitType: 'Loaf',
    status: 'Active',
    dateAdded: '2026-06-05T09:30:00Z',
    lastUpdated: '2026-06-22T07:15:00Z'
  },
  {
    id: 'p12',
    name: 'Yale Cabin Premium Biscuit Pack',
    category: 'Groceries',
    description: 'Crisp sweetened wheat cookies pack for teatime.',
    barcode: '5901234123462',
    costPrice: 1500,
    sellingPrice: 1800,
    quantity: 8, // Low Stock Warning
    reorderLevel: 12,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-05T10:00:00Z',
    lastUpdated: '2026-06-18T11:00:00Z'
  },

  // Beverages (11 items)
  {
    id: 'p13',
    name: 'Peak Full Cream Milk Powder 400g Refill',
    category: 'Beverages',
    description: 'Rich, creamy milk fortified with critical vitamins.',
    barcode: '5901234123463',
    costPrice: 3200,
    sellingPrice: 3900,
    quantity: 5, // Low Stock Warning
    reorderLevel: 15,
    unitType: 'Sachet',
    status: 'Active',
    dateAdded: '2026-06-06T11:00:00Z',
    lastUpdated: '2026-06-21T14:45:00Z'
  },
  {
    id: 'p14',
    name: 'Nestlé Milo Chocolate Malt Cereal 400g Refill',
    category: 'Beverages',
    description: 'Nourishing active malt cocoa drink mix.',
    barcode: '5901234123464',
    costPrice: 3100,
    sellingPrice: 3800,
    quantity: 16,
    reorderLevel: 15,
    unitType: 'Sachet',
    status: 'Active',
    dateAdded: '2026-06-06T11:30:00Z',
    lastUpdated: '2026-06-22T08:10:00Z'
  },
  {
    id: 'p15',
    name: 'Coca-Cola Refreshing Soda 50cl PET',
    category: 'Beverages',
    description: 'Sparkling cold cola carbonated beverage in PET bottle.',
    barcode: '5901234123465',
    costPrice: 230,
    sellingPrice: 300,
    quantity: 150,
    reorderLevel: 30,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-07T12:00:00Z',
    lastUpdated: '2026-06-22T08:20:00Z'
  },
  {
    id: 'p16',
    name: 'Sprite Lemon Lime Soda 50cl PET',
    category: 'Beverages',
    description: 'Crisp, clean lemon-lime calorie friendly sparkling soda.',
    barcode: '5901234123466',
    costPrice: 230,
    sellingPrice: 300,
    quantity: 120,
    reorderLevel: 30,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-07T12:15:00Z',
    lastUpdated: '2026-06-22T07:45:00Z'
  },
  {
    id: 'p17',
    name: 'Fanta Orange Sparkling Soda 50cl PET',
    category: 'Beverages',
    description: 'Deliciously bright and bubbly fruit-flavored orange drink.',
    barcode: '5901234123467',
    costPrice: 230,
    sellingPrice: 300,
    quantity: 110,
    reorderLevel: 30,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-07T12:30:00Z',
    lastUpdated: '2026-06-21T15:20:00Z'
  },
  {
    id: 'p18',
    name: 'Cway Pure Bottled Drinking Water 75cl Box',
    category: 'Beverages',
    description: 'Box pack of 12 natural spring drinking water bottles.',
    barcode: '5901234123468',
    costPrice: 1200,
    sellingPrice: 1600,
    quantity: 30,
    reorderLevel: 10,
    unitType: 'Carton',
    status: 'Active',
    dateAdded: '2026-06-08T13:00:00Z',
    lastUpdated: '2026-06-21T11:00:00Z'
  },
  {
    id: 'p19',
    name: 'Lipton Yellow Label Black Tea (100 Bags)',
    category: 'Beverages',
    description: 'Premium choice blend selected black teabags.',
    barcode: '5901234123469',
    costPrice: 900,
    sellingPrice: 1300,
    quantity: 35,
    reorderLevel: 10,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-08T14:00:00Z',
    lastUpdated: '2026-06-18T10:00:00Z'
  },
  {
    id: 'p20',
    name: 'Nescafé Gold Premium Blend Coffee 100g',
    category: 'Beverages',
    description: 'Freeze-dried soluble luxury instant dark coffee.',
    barcode: '5901234123470',
    costPrice: 4500,
    sellingPrice: 5500,
    quantity: 8, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Jar',
    status: 'Active',
    dateAdded: '2026-06-08T14:30:00Z',
    lastUpdated: '2026-06-20T16:00:00Z'
  },
  {
    id: 'p21',
    name: 'Hollandia Evaporated Liquid Milk Pack 1L',
    category: 'Beverages',
    description: 'Fortified ready-to-use liquid milk for cereals.',
    barcode: '5901234123471',
    costPrice: 1600,
    sellingPrice: 2000,
    quantity: 45,
    reorderLevel: 15,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-09T10:00:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'p22',
    name: 'Chivita Active 100% Fruit Juice 1L Tetra',
    category: 'Beverages',
    description: 'Pure citrus dynamic orange blend without additives.',
    barcode: '5901234123472',
    costPrice: 1300,
    sellingPrice: 1700,
    quantity: 28,
    reorderLevel: 15,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-09T10:30:00Z',
    lastUpdated: '2026-06-20T11:00:00Z'
  },
  {
    id: 'p23',
    name: 'Lucozade Energy Boost Drink 500ml',
    category: 'Beverages',
    description: 'Refreshing glucose-based energy revitalization beverage.',
    barcode: '5901234123473',
    costPrice: 850,
    sellingPrice: 1100,
    quantity: 72,
    reorderLevel: 15,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-09T11:00:00Z',
    lastUpdated: '2026-06-21T10:40:00Z'
  },

  // Cosmetics (7 items)
  {
    id: 'p24',
    name: 'Nivea Express Hydration Body Lotion 400ml',
    category: 'Cosmetics',
    description: 'Fast absorbing normal to dry skin body lotion.',
    barcode: '5901234123474',
    costPrice: 4200,
    sellingPrice: 5200,
    quantity: 25,
    reorderLevel: 10,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-10T09:00:00Z',
    lastUpdated: '2026-06-20T15:20:00Z'
  },
  {
    id: 'p25',
    name: 'Dove Beauty Moisture Soap Bar 100g',
    category: 'Cosmetics',
    description: 'Mild cleanser with 1/4 moisturizing cream.',
    barcode: '5901234123475',
    costPrice: 1000,
    sellingPrice: 1300,
    quantity: 32,
    reorderLevel: 10,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-10T09:40:00Z',
    lastUpdated: '2026-06-21T11:30:00Z'
  },
  {
    id: 'p26',
    name: 'Close-Up Triple Fresh Toothpaste 140g',
    category: 'Cosmetics',
    description: 'Red gel toothpaste with antibacterial zinc mouthwash formula.',
    barcode: '5901234123476',
    costPrice: 800,
    sellingPrice: 1100,
    quantity: 48,
    reorderLevel: 15,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-10T10:20:00Z',
    lastUpdated: '2026-06-22T08:15:00Z'
  },
  {
    id: 'p27',
    name: 'Dettol Original Antiseptic Liquid 500ml',
    category: 'Cosmetics',
    description: 'Trusted surface and first aid defense antiseptic liquid.',
    barcode: '5901234123477',
    costPrice: 2500,
    sellingPrice: 3200,
    quantity: 14,
    reorderLevel: 8,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-11T12:00:00Z',
    lastUpdated: '2026-06-21T13:45:00Z'
  },
  {
    id: 'p28',
    name: 'Vaseline Blue Seal Petroleum Jelly 250ml',
    category: 'Cosmetics',
    description: 'Pure skin protecting hypoallergenic petroleum gel.',
    barcode: '5901234123478',
    costPrice: 1100,
    sellingPrice: 1400,
    quantity: 19,
    reorderLevel: 5,
    unitType: 'Jar',
    status: 'Active',
    dateAdded: '2026-06-11T14:15:00Z',
    lastUpdated: '2026-06-20T17:00:00Z'
  },
  {
    id: 'p29',
    name: 'Sure Men Active Protection Anti-perspirant',
    category: 'Cosmetics',
    description: 'Aerosol deodorant spray offering 48 hours dry duration.',
    barcode: '5901234123479',
    costPrice: 2400,
    sellingPrice: 3000,
    quantity: 3, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Can',
    status: 'Active',
    dateAdded: '2026-06-11T15:00:00Z',
    lastUpdated: '2026-06-19T09:20:00Z'
  },
  {
    id: 'p30',
    name: 'Imperial Leather Soft-Skin Soap 100g',
    category: 'Cosmetics',
    description: 'Classic luxurious shower bathing soap with rose extracts.',
    barcode: '5901234123480',
    costPrice: 550,
    sellingPrice: 750,
    quantity: 60,
    reorderLevel: 15,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-11T16:00:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },

  // Household Items (7 items)
  {
    id: 'p31',
    name: 'Ariel Auto Washing Powder 1kg',
    category: 'Household Items',
    description: 'Excellent stain removal laundry detergent powder.',
    barcode: '5901234123481',
    costPrice: 3500,
    sellingPrice: 4200,
    quantity: 42,
    reorderLevel: 10,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-12T08:00:00Z',
    lastUpdated: '2026-06-20T11:45:00Z'
  },
  {
    id: 'p32',
    name: 'Rose Family White Toilet Tissue 4-Pack',
    category: 'Household Items',
    description: 'Soft 2-ply long-lasting quilted tissue rolls.',
    barcode: '5901234123482',
    costPrice: 1100,
    sellingPrice: 1500,
    quantity: 50,
    reorderLevel: 15,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-12T09:00:00Z',
    lastUpdated: '2026-06-21T18:30:05Z'
  },
  {
    id: 'p33',
    name: 'Sunlight Lemon Dishwash Liquid 1L',
    category: 'Household Items',
    description: 'Fast grease breakdown concentrated kitchen sink fluid.',
    barcode: '5901234123483',
    costPrice: 1100,
    sellingPrice: 1450,
    quantity: 25,
    reorderLevel: 8,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-12T10:00:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'p34',
    name: 'Harpic Active Fresh Power Toilet Cleaner 725ml',
    category: 'Household Items',
    description: 'Disinfectant toilet bowl liquid cleaner with pine scent.',
    barcode: '5901234123484',
    costPrice: 1800,
    sellingPrice: 2300,
    quantity: 18,
    reorderLevel: 8,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-13T11:00:00Z',
    lastUpdated: '2026-06-21T15:10:00Z'
  },
  {
    id: 'p35',
    name: 'Mortein PowerPoint Instant Insect Killer Spray',
    category: 'Household Items',
    description: 'High pressure dual-action mosquito and cockroach spray.',
    barcode: '5901234123485',
    costPrice: 2300,
    sellingPrice: 2900,
    quantity: 22,
    reorderLevel: 10,
    unitType: 'Can',
    status: 'Active',
    dateAdded: '2026-06-13T13:00:00Z',
    lastUpdated: '2026-06-21T12:00:00Z'
  },
  {
    id: 'p36',
    name: 'Air Wick Aerosol Air Freshener Lavender 300ml',
    category: 'Household Items',
    description: 'Instantly freshens room interior with soothing blossom aroma.',
    barcode: '5901234123486',
    costPrice: 1600,
    sellingPrice: 2100,
    quantity: 9, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Can',
    status: 'Active',
    dateAdded: '2026-06-13T14:40:00Z',
    lastUpdated: '2026-06-21T11:00:00Z'
  },
  {
    id: 'p37',
    name: 'Vim Lemon Scent Sanitizing Scouring Powder',
    category: 'Household Items',
    description: 'Stainless steel and ceramic grease-clearing abrasive powder.',
    barcode: '5901234123487',
    costPrice: 1300,
    sellingPrice: 1700,
    quantity: 15,
    reorderLevel: 5,
    unitType: 'Can',
    status: 'Active',
    dateAdded: '2026-06-13T15:00:00Z',
    lastUpdated: '2026-06-17T11:00:00Z'
  },

  // Electronics (5 items)
  {
    id: 'p38',
    name: 'Oraimo Toast-10 20000mAh Dual-USB Power Bank',
    category: 'Electronics',
    description: 'Multi-device fast-charging portable juice bank with LED display.',
    barcode: '5901234123488',
    costPrice: 14000,
    sellingPrice: 18000,
    quantity: 6, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-14T08:00:00Z',
    lastUpdated: '2026-06-19T13:40:00Z'
  },
  {
    id: 'p39',
    name: 'Binatone Typhoon Wall Fan 16-inch',
    category: 'Electronics',
    description: 'Heavy duty oscillating wall mounted safety mesh fan.',
    barcode: '5901234123489',
    costPrice: 27500,
    sellingPrice: 33000,
    quantity: 5, // Low Stock Warning
    reorderLevel: 5,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-14T09:30:00Z',
    lastUpdated: '2026-06-18T10:15:00Z'
  },
  {
    id: 'p40',
    name: 'Century Heavy Rechargeable LED Emergency Lantern',
    category: 'Electronics',
    description: 'Ultra bright long-lasting night beacon with USB charging port.',
    barcode: '5901234123490',
    costPrice: 6800,
    sellingPrice: 8500,
    quantity: 13,
    reorderLevel: 5,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-14T11:00:00Z',
    lastUpdated: '2026-06-21T18:00:00Z'
  },
  {
    id: 'p41',
    name: 'Binatone Safe-Protector 4-Way Overload Extension',
    category: 'Electronics',
    description: 'Indestructible brass contact extension socket with neon switches.',
    barcode: '5901234123491',
    costPrice: 3200,
    sellingPrice: 4200,
    quantity: 22,
    reorderLevel: 10,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-14T14:40:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'p42',
    name: 'Oraimo Gold-Plated Ultra HD HDMI Cable 3m',
    category: 'Electronics',
    description: '4K video 60Hz high-frequency nylon braided data line.',
    barcode: '5901234123492',
    costPrice: 1600,
    sellingPrice: 2300,
    quantity: 4, // Low Stock Warning
    reorderLevel: 10,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-14T15:00:00Z',
    lastUpdated: '2026-06-19T11:45:00Z'
  },

  // Stationery (4 items)
  {
    id: 'p43',
    name: 'Hardcover Notebook A4 80-Leaves (Pack of 6)',
    category: 'Stationery',
    description: 'Superior grade ruled paper premium bound books.',
    barcode: '5901234123493',
    costPrice: 2400,
    sellingPrice: 3000,
    quantity: 110,
    reorderLevel: 25,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-15T09:00:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'p44',
    name: 'Bic Cristal Medium Blue Ballpoint Pens Box (50s)',
    category: 'Stationery',
    description: 'Bulk box of smudge-free fine-tips writing ink pens.',
    barcode: '5901234123494',
    costPrice: 4500,
    sellingPrice: 5500,
    quantity: 15,
    reorderLevel: 5,
    unitType: 'Box',
    status: 'Active',
    dateAdded: '2026-06-15T11:00:00Z',
    lastUpdated: '2026-06-20T14:40:00Z'
  },
  {
    id: 'p45',
    name: 'Helix Oxford Premium Mathematical Geometry instrument Set',
    category: 'Stationery',
    description: 'Durable metal case compasses and rulers for measurements.',
    barcode: '5901234123495',
    costPrice: 1100,
    sellingPrice: 1500,
    quantity: 8, // Low Stock Warning
    reorderLevel: 12,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-15T14:40:00Z',
    lastUpdated: '2026-06-18T16:00:00Z'
  },
  {
    id: 'p46',
    name: 'Kangaroo Heavy Duty Stapler + Staples Box',
    category: 'Stationery',
    description: 'High penetration lever binder machine with 1000 staples pin package.',
    barcode: '5901234123496',
    costPrice: 1900,
    sellingPrice: 2500,
    quantity: 13,
    reorderLevel: 5,
    unitType: 'Pcs',
    status: 'Active',
    dateAdded: '2026-06-15T15:00:00Z',
    lastUpdated: '2026-06-21T17:15:00Z'
  },

  // Pharmaceuticals (4 items)
  {
    id: 'p47',
    name: 'Emzor Paracetamol Cold Relief BP 500mg (100 Tablets Box)',
    category: 'Pharmaceuticals',
    description: 'Rapid pain relief and fever treatment tablets.',
    barcode: '5901234123497',
    costPrice: 800,
    sellingPrice: 1200,
    quantity: 50,
    reorderLevel: 10,
    unitType: 'Box',
    status: 'Active',
    dateAdded: '2026-06-16T10:00:00Z',
    lastUpdated: '2026-06-22T08:00:00Z'
  },
  {
    id: 'p48',
    name: 'Vitamin C Syrup Emzor Orange flavor 100ml',
    category: 'Pharmaceuticals',
    description: 'Immunity support supplement drops for growing children.',
    barcode: '5901234123498',
    costPrice: 900,
    sellingPrice: 1300,
    quantity: 24,
    reorderLevel: 10,
    unitType: 'Bottle',
    status: 'Active',
    dateAdded: '2026-06-16T11:30:00Z',
    lastUpdated: '2026-06-21T16:00:00Z'
  },
  {
    id: 'p49',
    name: 'Panadol Extra Quick Relief (Pack of 10 Tablets)',
    category: 'Pharmaceuticals',
    description: 'Advanced dual-strength headache relief medication formula.',
    barcode: '5901234123499',
    costPrice: 450,
    sellingPrice: 650,
    quantity: 125,
    reorderLevel: 20,
    unitType: 'Pack',
    status: 'Active',
    dateAdded: '2026-06-16T14:40:00Z',
    lastUpdated: '2026-06-22T08:15:00Z'
  },
  {
    id: 'p50',
    name: 'Elastoplast Waterproof Dressing Family Bandages Group',
    category: 'Pharmaceuticals',
    description: 'Anti-infection surgical dress plaster collection (40 units).',
    barcode: '5901235123500',
    costPrice: 1200,
    sellingPrice: 1700,
    quantity: 12,
    reorderLevel: 5,
    unitType: 'Box',
    status: 'Active',
    dateAdded: '2026-06-16T15:00:00Z',
    lastUpdated: '2026-06-20T11:00:00Z'
  },

  // Services (2 items)
  {
    id: 'p51',
    name: 'Standard Home Delivery Dispatch Charge',
    category: 'Services',
    description: 'Rapid dispatch rider door delivery logistics within core Lekki.',
    barcode: 'N/A',
    costPrice: 1500,
    sellingPrice: 3000,
    quantity: 9999, // Unbounded service
    reorderLevel: 0,
    unitType: 'Job',
    status: 'Active',
    dateAdded: '2026-06-17T08:00:00Z',
    lastUpdated: '2026-06-17T08:00:00Z'
  },
  {
    id: 'p52',
    name: 'Express VIP Decorative Gift Wrapping Service',
    category: 'Services',
    description: 'Luxurious ribbon and custom casing decorative presentation package.',
    barcode: 'N/A',
    costPrice: 500,
    sellingPrice: 1200,
    quantity: 9999, // Unbounded
    reorderLevel: 0,
    unitType: 'Job',
    status: 'Active',
    dateAdded: '2026-06-17T09:00:00Z',
    lastUpdated: '2026-06-17T09:00:00Z'
  }
];

// Past 5 general retail sales seeds
export const SEED_GENERAL_SALES: GeneralSale[] = [
  {
    id: 'gs1',
    receiptNumber: 'GS-000001',
    items: [
      { productId: 'p1', productName: 'Dangote Long Grain Rice 50kg', price: 85000, quantity: 1, total: 85000 },
      { productId: 'p15', productName: 'Coca-Cola Refreshing Soda 50cl PET', price: 300, quantity: 4, total: 1200 }
    ],
    totalQuantity: 5,
    subtotal: 86200,
    discount: 1200,
    tax: 0,
    grandTotal: 85000,
    cashReceived: 90000,
    balanceReturned: 5000,
    cashierName: 'Precious Okon',
    date: '2026-06-20',
    time: '11:40'
  },
  {
    id: 'gs2',
    receiptNumber: 'GS-000002',
    items: [
      { productId: 'p13', productName: 'Peak Full Cream Milk Powder 400g Refill', price: 3900, quantity: 2, total: 7800 },
      { productId: 'p14', productName: 'Nestlé Milo Chocolate Malt Cereal 400g Refill', price: 3800, quantity: 2, total: 7600 },
      { productId: 'p11', productName: 'Butterfield Sliced Bread', price: 1400, quantity: 2, total: 2800 }
    ],
    totalQuantity: 6,
    subtotal: 18200,
    discount: 500,
    tax: 0,
    grandTotal: 17700,
    cashReceived: 20000,
    balanceReturned: 2300,
    cashierName: 'Fatima Umar',
    date: '2026-06-21',
    time: '10:15'
  },
  {
    id: 'gs3',
    receiptNumber: 'GS-000003',
    items: [
      { productId: 'p38', productName: 'Oraimo Toast-10 20000mAh Dual-USB Power Bank', price: 18000, quantity: 1, total: 18000 },
      { productId: 'p41', productName: 'Binatone Safe-Protector 4-Way Overload Extension', price: 4200, quantity: 1, total: 4200 }
    ],
    totalQuantity: 2,
    subtotal: 22200,
    discount: 0,
    tax: 0,
    grandTotal: 22200,
    cashReceived: 25000,
    balanceReturned: 2800,
    cashierName: 'Precious Okon',
    date: '2026-06-21',
    time: '14:30'
  },
  {
    id: 'gs4',
    receiptNumber: 'GS-000004',
    items: [
      { productId: 'p3', productName: 'Indomie Instant Noodles Onion Carton', price: 7800, quantity: 3, total: 23400 },
      { productId: 'p5', productName: 'Devon King\'s Pure Vegetable Oil 5L', price: 12500, quantity: 1, total: 12500 },
      { productId: 'p51', productName: 'Standard Home Delivery Dispatch Charge', price: 3000, quantity: 1, total: 3000 }
    ],
    totalQuantity: 5,
    subtotal: 38900,
    discount: 900,
    tax: 0,
    grandTotal: 38000,
    cashReceived: 38000,
    balanceReturned: 0,
    cashierName: 'Fatima Umar',
    date: '2026-06-22',
    time: '08:15'
  },
  {
    id: 'gs5',
    receiptNumber: 'GS-000005',
    items: [
      { productId: 'p47', productName: 'Emzor Paracetamol Cold Relief BP 500mg', price: 1200, quantity: 3, total: 3600 },
      { productId: 'p49', productName: 'Panadol Extra Quick Relief', price: 650, quantity: 5, total: 3250 }
    ],
    totalQuantity: 8,
    subtotal: 6855,
    discount: 355,
    tax: 0,
    grandTotal: 6500,
    cashReceived: 10000,
    balanceReturned: 3500,
    cashierName: 'Precious Okon',
    date: '2026-06-22',
    time: '09:05'
  }
];

export const SEED_STOCK_LOGS: StockLog[] = [
  {
    id: 'log1',
    productId: 'p1',
    productName: 'Dangote Long Grain Rice 50kg',
    prevQuantity: 10,
    newQuantity: 15,
    quantityChanged: 5,
    actionType: 'Addition',
    adminName: 'Alhaji Ibrahim',
    date: '2026-06-20T10:00:00Z'
  },
  {
    id: 'log2',
    productId: 'p2',
    productName: 'Dangote Long Grain Rice 25kg',
    prevQuantity: 12,
    newQuantity: 6,
    quantityChanged: -6,
    actionType: 'Reduction',
    adminName: 'Alhaji Ibrahim',
    date: '2026-06-21T11:00:00Z'
  },
  {
    id: 'log3',
    productId: 'p38',
    productName: 'Oraimo Toast-10 20000mAh Dual-USB Power Bank',
    prevQuantity: 1,
    newQuantity: 6,
    quantityChanged: 5,
    actionType: 'Adjustment',
    adminName: 'Alhaji Ibrahim',
    date: '2026-06-19T13:40:00Z'
  }
];

// Helper functions for Database interactions
export function getSavedProducts(): Product[] {
  const existing = localStorage.getItem('retail_products');
  if (!existing) {
    localStorage.setItem('retail_products', JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  return JSON.parse(existing);
}

export function saveProducts(products: Product[]) {
  localStorage.setItem('retail_products', JSON.stringify(products));
}

export function getSavedGeneralSales(): GeneralSale[] {
  const existing = localStorage.getItem('general_sales');
  if (!existing) {
    localStorage.setItem('general_sales', JSON.stringify(SEED_GENERAL_SALES));
    return SEED_GENERAL_SALES;
  }
  return JSON.parse(existing);
}

export function saveGeneralSales(sales: GeneralSale[]) {
  localStorage.setItem('general_sales', JSON.stringify(sales));
}

export function getSavedStockLogs(): StockLog[] {
  const existing = localStorage.getItem('stock_logs');
  if (!existing) {
    localStorage.setItem('stock_logs', JSON.stringify(SEED_STOCK_LOGS));
    return SEED_STOCK_LOGS;
  }
  return JSON.parse(existing);
}

export function saveStockLogs(logs: StockLog[]) {
  localStorage.setItem('stock_logs', JSON.stringify(logs));
}

