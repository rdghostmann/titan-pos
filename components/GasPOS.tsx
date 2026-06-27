"use client";
import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  RotateCcw, 
  CheckCircle, 
  X, 
  Phone, 
  User as UserIcon, 
  Layers, 
  Scale, 
  DollarSign, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { GasSale } from '@/types';
import { ATTENDANTS_GAS, CASHIERS, GAS_RETAIL_PRICE_PER_KG, formatNaira } from '@/mockData';

const STATIC_GAS_SALES: GasSale[] = [
  {
    id: 'gas-1',
    receiptNumber: 'GAS-20260621-001',
    date: '2026-06-21T10:15:00.000Z',
    customerName: 'Kemi Adebayo',
    customerPhone: '+2348012345678',
    cylinderSize: '12.5kg',
    quantity: 12.5,
    pricePerKg: GAS_RETAIL_PRICE_PER_KG,
    amount: 125000,
    paymentMethod: 'Cash',
    attendant: 'Amina Yusuf',
    cashier: 'Tunde Bassey',
    remarks: 'Delivered within 20 mins'
  },
  {
    id: 'gas-2',
    receiptNumber: 'GAS-20260621-002',
    date: '2026-06-21T11:40:00.000Z',
    customerName: 'Ibrahim Musa',
    customerPhone: '+2348098765432',
    cylinderSize: '6kg',
    quantity: 6,
    pricePerKg: GAS_RETAIL_PRICE_PER_KG,
    amount: 72000,
    paymentMethod: 'POS',
    attendant: 'Bola Okafor',
    cashier: 'Grace Eze',
    remarks: 'Customer requested fast refill'
  },
  {
    id: 'gas-3',
    receiptNumber: 'GAS-20260621-003',
    date: '2026-06-21T13:05:00.000Z',
    customerName: 'Ngozi Chukwu',
    customerPhone: '+2347055544433',
    cylinderSize: '25kg',
    quantity: 25,
    pricePerKg: GAS_RETAIL_PRICE_PER_KG,
    amount: 250000,
    paymentMethod: 'Bank Transfer',
    attendant: 'Amina Yusuf',
    cashier: 'Tunde Bassey',
    remarks: 'Advance payment received'
  }
];

export default function GasPOS() {
  const [currentRole] = useState('Administrator');
  const [currentUser] = useState('System');
  const [sales, setSales] = useState<GasSale[]>(STATIC_GAS_SALES);
  // Local active form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cylinderSize, setCylinderSize] = useState<'3kg' | '5kg' | '6kg' | '12.5kg' | '25kg' | '50kg'>('12.5kg');
  const [quantity, setQuantity] = useState<number>(12.5); // Default to cylinder size
  const [pricePerKg, setPricePerKg] = useState<number>(GAS_RETAIL_PRICE_PER_KG);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'POS'>('Cash');
  const [attendant, setAttendant] = useState(ATTENDANTS_GAS[0]);
  const [cashier, setCashier] = useState(CASHIERS[0]);
  const [remarks, setRemarks] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSize, setFilterSize] = useState<string>('All');
  const [filterPayment, setFilterPayment] = useState<string>('All');

  // Active receipt for printing modal
  const [activeReceipt, setActiveReceipt] = useState<GasSale | null>(null);
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  // Synchronize quantity when cylinderSize changes
  useEffect(() => {
    const sizeMap: Record<string, number> = {
      '3kg': 3,
      '5kg': 5,
      '6kg': 6,
      '12.5kg': 12.5,
      '25kg': 25,
      '50kg': 50,
    };
    setQuantity(sizeMap[cylinderSize] || 12.5);
  }, [cylinderSize]);

  // Handle auto calculation of receipt number
  const nextReceiptNumber = (() => {
    const today = new Date('2026-06-21');
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const prefix = `GAS-${yyyy}${mm}${dd}`;
    const count = sales.filter(s => s.receiptNumber.startsWith(prefix)).length;
    return `${prefix}-${String(count + 1).padStart(3, '0')}`;
  })();

  // Auto-calculated amount
  const totalAmount = Number((quantity * pricePerKg).toFixed(2));

  // Clean / reset form
  const clearForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCylinderSize('12.5kg');
    setQuantity(12.5);
    setPricePerKg(GAS_RETAIL_PRICE_PER_KG);
    setPaymentMethod('Cash');
    setAttendant(ATTENDANTS_GAS[0]);
    setCashier(CASHIERS[0]);
    setRemarks('');
  };

  // Submit and save transaction
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please enter a Customer Name', 'error');
      return;
    }
    if (quantity <= 0) {
      showToast('Quantity filled must be greater than 0', 'error');
      return;
    }
    if (pricePerKg <= 0) {
      showToast('Price per KG must be greater than 0', 'error');
      return;
    }

    const newSale: GasSale = {
      id: 'gas-' + Date.now(),
      receiptNumber: nextReceiptNumber,
      date: new Date('2026-06-21T14:45:00').toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      cylinderSize,
      quantity,
      pricePerKg,
      amount: totalAmount,
      paymentMethod,
      attendant,
      cashier,
      remarks: remarks.trim()
    };

    setSales([newSale, ...sales]);
    console.info(`Gas Transaction ${newSale.receiptNumber} Saved Successfully!`);

    // Auto-prompt thermal receipt modal
    setActiveReceipt(newSale);
    clearForm();
  };

  // Filter records based on role rules
  // Rule: Pump Attendant can only see their OWN records
  const filteredSalesByRole = currentRole === 'Pump Attendant'
    ? sales.filter(s => s.attendant.toLowerCase().includes(currentUser.toLowerCase()))
    : sales;

  // Apply search query & filters
  const searchedSales = filteredSalesByRole.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      s.customerName.toLowerCase().includes(query) ||
      s.receiptNumber.toLowerCase().includes(query) ||
      s.customerPhone.toLowerCase().includes(query) ||
      s.attendant.toLowerCase().includes(query) ||
      s.cashier.toLowerCase().includes(query);

    const matchSize = filterSize === 'All' || s.cylinderSize === filterSize;
    const matchPayment = filterPayment === 'All' || s.paymentMethod === filterPayment;

    return matchSearch && matchSize && matchPayment;
  });

  // Stats summaries for Gas Sales view
  const localStats = {
    totalSales: searchedSales.reduce((s, g) => s + g.amount, 0),
    totalKg: searchedSales.reduce((s, g) => s + g.quantity, 0),
    totalCount: searchedSales.length,
  };

  // Trigger Native browser printing
  const triggerNativePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="gas-pos-container">
      {/* Header and Quick Navigation context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs" id="gas-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-xl text-orange-600 dark:text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Cooking Gas Point of Sale</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Record refills, manage cylinders & print immediate receipts</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
          TICKET AUTO-SEQUENCE: <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">{nextReceiptNumber}</span>
        </div>
      </div>

      {/* Grid of Sales Form + Active Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="gas-pos-split-grid">
        {/* Module A: Sales Entry Form */}
        <div className="lg:col-span-4" id="gas-form-panel">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-700 pb-3">
              Sale Transaction Form
            </h2>

            <form onSubmit={handleSave} className="space-y-4" id="gas-sale-form">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Customer Name *
                </label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kolawole Davies"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  required
                />
              </div>

              {/* Customer Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                </label>
                <input 
                  type="text" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +2348012345678"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              {/* Cylinder Size and Quantity Grid */}
              <div className="grid grid-cols-2 gap-3" id="cylinder-qty-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" /> Cylinder Size
                  </label>
                  <select
                    value={cylinderSize}
                    onChange={(e) => setCylinderSize(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  >
                    <option value="3kg">3 kg</option>
                    <option value="5kg">5 kg</option>
                    <option value="6kg">6 kg</option>
                    <option value="12.5kg">12.5 kg</option>
                    <option value="25kg">25 kg</option>
                    <option value="50kg">50 kg</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" /> Weight filled (KG)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>
              </div>

              {/* Price per KG & Total (Side-by-side) */}
              <div className="grid grid-cols-2 gap-3" id="price-total-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price/KG (₦)
                  </label>
                  <input 
                    type="number" 
                    value={pricePerKg} 
                    onChange={(e) => setPricePerKg(Math.max(0, Number(e.target.value)))}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-700/20 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Bill</span>
                  <span className="text-base font-bold text-orange-600 dark:text-orange-400 truncate">{formatNaira(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Payment Method</label>
                <div className="grid grid-cols-3 gap-2" id="payment-methods-radio">
                  {['Cash', 'Bank Transfer', 'POS'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method as any)}
                      className={`py-1.5 text-xs rounded-lg font-semibold border transition-all ${
                        paymentMethod === method 
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendant & Cashier */}
              <div className="grid grid-cols-2 gap-3" id="staff-entry-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Pump Attendant</label>
                  <select
                    value={attendant}
                    onChange={(e) => setAttendant(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {ATTENDANTS_GAS.map(att => (
                      <option key={att} value={att}>{att}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Cashier</label>
                  <select
                    value={cashier}
                    onChange={(e) => setCashier(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {CASHIERS.map(cash => (
                      <option key={cash} value={cash}>{cash}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional notes e.g. custom cylinder valve replaced"
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                ></textarea>
              </div>

              {/* Form Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2" id="form-buttons">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Module B: Sales Log / Historical View */}
        <div className="lg:col-span-8 space-y-4" id="gas-records-panel">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-4">
            {/* Table Filter Top Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center border-b border-slate-50 dark:border-slate-700 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Cooking Gas Sales Registers</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentRole === 'Pump Attendant' ? `Showing your custom logs only (Attendant: ${currentUser})` : 'All gas plant sales accounts'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2" id="gas-filters-group">
                {/* Size Filter */}
                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="All">All Cylinders</option>
                  <option value="3kg">3kg</option>
                  <option value="5kg">5kg</option>
                  <option value="6kg">6kg</option>
                  <option value="12.5kg">12.5kg</option>
                  <option value="25kg">25kg</option>
                  <option value="50kg">50kg</option>
                </select>

                {/* Payment Method Filter */}
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="All">All Payments</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="POS">POS</option>
                </select>
              </div>
            </div>

            {/* Live Search input */}
            <div className="relative" id="gas-search-box">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, order number, attendant, cashier size..."
                className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Microstats */}
            <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-center" id="gas-filtered-microstats">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Total Sales</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{formatNaira(localStats.totalSales)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Total Weight</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{localStats.totalKg.toLocaleString()} KG</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Records</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{localStats.totalCount} Bills</span>
              </div>
            </div>

            {/* Simple Responsive Table */}
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-700/50 rounded-xl" id="gas-sales-table-scroller">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700/50">
                  <tr>
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Cylinder</th>
                    <th className="p-3">Qty (KG)</th>
                    <th className="p-3">Total (₦)</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Attendant</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 dark:text-slate-300">
                  {searchedSales.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        <Flame className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-60" />
                        No Gas Sales matching filters discovered.
                      </td>
                    </tr>
                  ) : (
                    searchedSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-mono font-medium text-blue-600 dark:text-blue-400 shrink-0">{sale.receiptNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold">{sale.customerName}</div>
                          <div className="text-[10px] text-slate-500">{sale.customerPhone}</div>
                        </td>
                        <td className="p-3 font-medium">{sale.cylinderSize}</td>
                        <td className="p-3">{sale.quantity} kg</td>
                        <td className="p-3 font-bold">{formatNaira(sale.amount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            sale.paymentMethod === 'Cash' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                              : sale.paymentMethod === 'POS'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}>
                            {sale.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 truncate max-w-25" title={sale.attendant}>{sale.attendant.split(' ')[0]}</td>
                        <td className="p-3 text-right flex gap-1 justify-end">
                          <button
                            onClick={() => setActiveReceipt(sale)}
                            title="Print Receipt"
                            className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {(currentRole === 'Administrator' || currentRole === 'Cashier') && (
                            <button
                              onClick={() => {
                                if (confirm('Are you certain you wish to purge this transaction file?')) {
                                  setSales(prev => prev.filter(item => item.id !== sale.id));
                                  console.info('Transaction file successfully deleted.');
                                }
                              }}
                              title="Delete Record"
                              className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL WINDOW FOR PRINTING RECEIPT */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" id="receipt-modal">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-3xl">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                  <Flame className="w-4 h-4 text-orange-500" /> Gas SBU Transaction Receipt
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activeReceipt.receiptNumber}</p>
              </div>
              <button 
                onClick={() => setActiveReceipt(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Selection Format & Action Bar */}
            <div className="p-3 bg-blue-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrintFormat('thermal')}
                  className={`px-3 py-1 rounded-md font-semibold border transition ${
                    printFormat === 'thermal' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Thermal Receipt (58mm)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('a4')}
                  className={`px-3 py-1 rounded-md font-semibold border transition ${
                    printFormat === 'a4' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Corporate Letter / A4 Invoice
                </button>
              </div>

              <button
                type="button"
                onClick={triggerNativePrint}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md font-semibold flex items-center gap-1 shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" /> Direct Print
              </button>
            </div>

            {/* PRINT WRAPPER: Matches class for windows media print */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50 dark:bg-slate-900/20" id="receipt-print-wrapper">
              <div 
                id="receipt-print-area" 
                className={`mx-auto bg-white text-black p-6 shadow-sm border border-slate-200 rounded-md font-mono ${
                  printFormat === 'thermal' ? 'max-w-70 text-[10px]' : 'max-w-120 text-xs'
                }`}
              >
                
                {/* BRAND LOGO AND ADDRESS */}
                <div className="text-center space-y-1">
                  {/* Embedded Custom SVG Logo representing Gas & Carwash Combined */}
                  <svg className="w-10 h-10 mx-auto text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <h2 className="text-sm font-bold tracking-tight uppercase">SBU GAS OIL CO. LTD</h2>
                  <p className="text-[9px] text-slate-600">Plot 104, Gas Plant Industrial Way, Lekki Phase 1, Lagos</p>
                  <p className="text-[9px] text-slate-600">Tel: +234 1 293 4000 • Email: info@gaswashpos.com</p>
                  <div className="border-t border-dashed border-gray-400 my-2"></div>
                </div>

                {/* RECORD TITLE */}
                <p className="text-center font-bold uppercase tracking-wider text-[11px] mb-3">COOKING GAS REFILL RECEIPT</p>

                {/* FIELDS VALUES */}
                <table className="w-full text-left space-y-1">
                  <tbody>
                    <tr>
                      <td className="text-slate-600 font-semibold">DATE:</td>
                      <td className="text-right">{new Date(activeReceipt.date).toLocaleString('en-US')}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600 font-semibold">TICKET No:</td>
                      <td className="text-right font-bold text-blue-800">{activeReceipt.receiptNumber}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600 font-semibold">CUSTOMER:</td>
                      <td className="text-right font-semibold">{activeReceipt.customerName}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600 font-semibold">PHONE:</td>
                      <td className="text-right">{activeReceipt.customerPhone}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* ITEMIZATION TABLE */}
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="border-b border-gray-400 font-bold">
                      <th>ITEM SIZE</th>
                      <th className="text-right">QTY</th>
                      <th className="text-right">RATE (₦)</th>
                      <th className="text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">LPG Gas ({activeReceipt.cylinderSize})</td>
                      <td className="text-right py-1">{activeReceipt.quantity} kg</td>
                      <td className="text-right py-1">{activeReceipt.pricePerKg.toLocaleString()}</td>
                      <td className="text-right py-1 font-bold">{formatNaira(activeReceipt.amount)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* GRAND TOTAL ROW */}
                <div className="border-t border-dashed border-gray-400 my-3"></div>
                
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-xs uppercase">
                    <span>Grand Total:</span>
                    <span>{formatNaira(activeReceipt.amount)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Payment Mode:</span>
                    <span className="font-bold uppercase">{activeReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Pump Attendant:</span>
                    <span>{activeReceipt.attendant}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Cashier Desk:</span>
                    <span>{activeReceipt.cashier}</span>
                  </div>
                </div>

                {/* REMARKS IF PRESENT */}
                {activeReceipt.remarks && (
                  <div className="bg-slate-50 p-2 rounded border border-gray-200 mt-3 text-[9px]">
                    <span className="font-bold block">REMARKS:</span>
                    <span>{activeReceipt.remarks}</span>
                  </div>
                )}

                {/* FOOTER THANK YOU */}
                <div className="border-t border-dashed border-gray-400 my-3"></div>
                <div className="text-center space-y-1 text-[9px] text-slate-600">
                  <p className="font-bold uppercase">THANK YOU FOR YOUR PATRONAGE!</p>
                  <p>Check cylinder locks & keep well ventilated</p>
                  <p>Powered by GasPlant & CarWash POS Hub</p>
                </div>

              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end bg-slate-50 dark:bg-slate-900 rounded-b-3xl">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg text-xs font-semibold transition animate-none"
              >
                Close Receipt View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
