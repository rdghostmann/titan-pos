"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Droplet, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  RotateCcw, 
  CheckCircle, 
  X, 
  Phone, 
  User as UserIcon, 
  Tag, 
  FileText, 
  Car, 
  Layers, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import { CarWashSale, UserRole } from '@/types';
import { ATTENDANTS_CARWASH, CASHIERS, CARWASH_PRICING, formatNaira } from '@/mockData';

interface CarWashPOSProps {
  sales: CarWashSale[];
  onAddSale: (sale: CarWashSale) => void;
  onDeleteSale: (id: string) => void;
  currentRole: UserRole;
  currentUser: string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function CarWashPOS({ sales, onAddSale, onDeleteSale, currentRole, currentUser, showToast }: CarWashPOSProps) {
  // Local active form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleNumberPlate, setVehicleNumberPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<'Sedan' | 'SUV' | 'Truck' | 'Bus' | 'Motorcycle'>('Sedan');
  const [serviceType, setServiceType] = useState<'Exterior Wash' | 'Interior Wash' | 'Full Wash' | 'Engine Wash' | 'Waxing' | 'Detailing'>('Full Wash');
  const [amount, setAmount] = useState<number>(2500); // Dynamic trigger based on selection
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'POS'>('Cash');
  const [attendant, setAttendant] = useState(ATTENDANTS_CARWASH[0]);
  const [cashier, setCashier] = useState(CASHIERS[0]);
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [remarks, setRemarks] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVehicle, setFilterVehicle] = useState<string>('All');
  const [filterService, setFilterService] = useState<string>('All');

  // Active receipt for printing modal
  const [activeReceipt, setActiveReceipt] = useState<CarWashSale | null>(null);
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  // Auto initialize current hour/minute
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    setTimeIn(`${hh}:${mm}`);

    // Auto calculate Time Out as +45 minutes
    const future = new Date(now.getTime() + 45 * 60000);
    setTimeOut(`${pad(future.getHours())}:${pad(future.getMinutes())}`);
  }, []);

  // Synchronize pricing automatically when vehicle/service type changes, letting users override if desired
  useEffect(() => {
    const basePrices = CARWASH_PRICING[vehicleType];
    if (basePrices && basePrices[serviceType]) {
      setAmount(basePrices[serviceType]);
    }
  }, [vehicleType, serviceType]);

  // Handle auto calculation of receipt number
  const nextReceiptNumber = useMemo(() => {
    const today = new Date('2026-06-21'); // current context date
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const prefix = `CW-${yyyy}${mm}${dd}`;

    // Count existing car wash sales for today
    const count = sales.filter(s => s.receiptNumber.startsWith(prefix)).length;
    return `${prefix}-${String(count + 1).padStart(3, '0')}`;
  }, [sales]);

  // Reset form helper
  const clearForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setVehicleNumberPlate('');
    setVehicleType('Sedan');
    setServiceType('Full Wash');
    setPaymentMethod('Cash');
    setAttendant(ATTENDANTS_CARWASH[0]);
    setCashier(CASHIERS[0]);
    setRemarks('');

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    setTimeIn(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    const future = new Date(now.getTime() + 45 * 60000);
    setTimeOut(`${pad(future.getHours())}:${pad(future.getMinutes())}`);
  };

  // Submit and save transaction
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please enter a Customer Name', 'error');
      return;
    }
    if (!vehicleNumberPlate.trim()) {
      showToast('Please specify the Vehicle Plate Number', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('Amount must be positive', 'error');
      return;
    }

    const newSale: CarWashSale = {
      id: 'cw-' + Date.now(),
      receiptNumber: nextReceiptNumber,
      date: new Date('2026-06-21T14:45:00').toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      vehicleNumberPlate: vehicleNumberPlate.trim().toUpperCase(),
      vehicleType,
      serviceType,
      amount,
      paymentMethod,
      attendant,
      cashier,
      timeIn: timeIn || 'N/A',
      timeOut: timeOut || 'N/A',
      remarks: remarks.trim()
    };

    onAddSale(newSale);
    showToast(`Car Wash ticket ${newSale.receiptNumber} Saved Successfully!`, 'success');
    
    // Auto-prompt thermal receipt modal
    setActiveReceipt(newSale);
    clearForm();
  };

  // Conditional records list based on active role
  // Rule: Car Wash Attendant can only see their own records
  const filteredSalesByRole = useMemo(() => {
    if (currentRole === 'Car Wash Attendant') {
      return sales.filter(s => s.attendant.toLowerCase().includes(currentUser.toLowerCase()));
    }
    return sales;
  }, [sales, currentRole, currentUser]);

  // Apply search query & filters
  const searchedSales = useMemo(() => {
    return filteredSalesByRole.filter(s => {
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        s.customerName.toLowerCase().includes(query) ||
        s.receiptNumber.toLowerCase().includes(query) ||
        s.vehicleNumberPlate.toLowerCase().includes(query) ||
        s.attendant.toLowerCase().includes(query) ||
        s.cashier.toLowerCase().includes(query);

      const matchVehicle = filterVehicle === 'All' || s.vehicleType === filterVehicle;
      const matchService = filterService === 'All' || s.serviceType === filterService;

      return matchSearch && matchVehicle && matchService;
    });
  }, [filteredSalesByRole, searchQuery, filterVehicle, filterService]);

  // Mini summary calculations
  const localStats = useMemo(() => {
    const totalSales = searchedSales.reduce((s, c) => s + c.amount, 0);
    const totalCount = searchedSales.length;
    return { totalSales, totalCount };
  }, [searchedSales]);

  // Trigger Native browser printing
  const triggerNativePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="carwash-pos-container">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs" id="carwash-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-950/40 rounded-xl text-green-600 dark:text-green-400">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Car Wash Point of Sale</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Book cleans, track vehicle wash queues & dispatch receipts</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
          TICKET AUTO-SEQUENCE: <span className="font-mono text-green-600 dark:text-green-400 font-bold">{nextReceiptNumber}</span>
        </div>
      </div>

      {/* Grid: Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="carwash-split-grid">
        {/* Module A: Wash Job Intake Form */}
        <div className="lg:col-span-4" id="carwash-form-panel">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-700 pb-3">
              Wash Intake Intake
            </h2>

            <form onSubmit={handleSave} className="space-y-4" id="carwash-sale-form">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Customer Name *
                </label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Chief Gbolahan"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
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
                  placeholder="e.g. +234812334455"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              {/* Vehicle Number Plate */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" /> Number Plate *
                </label>
                <input 
                  type="text" 
                  value={vehicleNumberPlate} 
                  onChange={(e) => setVehicleNumberPlate(e.target.value)}
                  placeholder="e.g. KJA-345LK"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  required
                />
              </div>

              {/* Vehicle Type and Service Type Grid */}
              <div className="grid grid-cols-2 gap-3" id="vehicle-srv-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Bus">Bus</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Service Category</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Exterior Wash">Exterior Wash</option>
                    <option value="Interior Wash">Interior Wash</option>
                    <option value="Full Wash">Full Wash</option>
                    <option value="Engine Wash">Engine Wash</option>
                    <option value="Waxing">Waxing</option>
                    <option value="Detailing">Detailing</option>
                  </select>
                </div>
              </div>

              {/* pricing details with option to manual override */}
              <div className="grid grid-cols-2 gap-3" id="amount-pricing-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Charge Price (₦) *</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    required
                  />
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-700/20 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Standard Price</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    ₦{(CARWASH_PRICING[vehicleType]?.[serviceType] || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Time In and Time Out */}
              <div className="grid grid-cols-2 gap-3" id="wash-duration-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Time In
                  </label>
                  <input 
                    type="text" 
                    value={timeIn} 
                    onChange={(e) => setTimeIn(e.target.value)}
                    placeholder="e.g. 09:12"
                    className="w-full text-xs px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Est. Time Out
                  </label>
                  <input 
                    type="text" 
                    value={timeOut} 
                    onChange={(e) => setTimeOut(e.target.value)}
                    placeholder="e.g. 09:55"
                    className="w-full text-xs px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Payment Option</label>
                <div className="grid grid-cols-3 gap-2" id="payment-methods-radio">
                  {['Cash', 'Bank Transfer', 'POS'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method as any)}
                      className={`py-1.5 text-xs rounded-lg font-semibold border transition-all ${
                        paymentMethod === method 
                          ? 'bg-green-600 text-white border-green-600 shadow-xs' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendant & Cashier Selectors */}
              <div className="grid grid-cols-2 gap-3 animate-none" id="staff-entry-grid">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Wash Attendant</label>
                  <select
                    value={attendant}
                    onChange={(e) => setAttendant(e.target.value)}
                    className="w-full text-xs px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {ATTENDANTS_CARWASH.map(att => (
                      <option key={att} value={att}>{att}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Cashier Counter</label>
                  <select
                    value={cashier}
                    onChange={(e) => setCashier(e.target.value)}
                    className="w-full text-xs px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {CASHIERS.map(cash => (
                      <option key={cash} value={cash}>{cash}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks Box */}
              <div className="space-y-1 animate-none">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Remarks / Specifications</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Clean floor mats meticulously; customer left keys"
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none"
                ></textarea>
              </div>

              {/* Action grid options */}
              <div className="grid grid-cols-2 gap-2 pt-2 animate-none" id="form-buttons">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm shadow-green-500/20"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Save Job
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Module B: Wash Records Ledger */}
        <div className="lg:col-span-8 space-y-4" id="carwash-records-panel">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center border-b border-slate-50 dark:border-slate-700 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Car Wash Center Booking Board</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentRole === 'Car Wash Attendant' ? `Showing your custom records only (Attendant: ${currentUser})` : 'All car wash bookings ledger'}
                </p>
              </div>

              {/* Filtering board */}
              <div className="flex flex-wrap items-center gap-2" id="cw-filters-group">
                <select
                  value={filterVehicle}
                  onChange={(e) => setFilterVehicle(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="All">All Vehicle Types</option>
                  <option value="Sedan">Sedans</option>
                  <option value="SUV">SUVs</option>
                  <option value="Truck">Trucks</option>
                  <option value="Bus">Buses</option>
                  <option value="Motorcycle">Motorcycles</option>
                </select>

                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="All">All Services</option>
                  <option value="Exterior Wash">Exterior Wash</option>
                  <option value="Interior Wash">Interior Wash</option>
                  <option value="Full Wash">Full Wash</option>
                  <option value="Engine Wash">Engine Wash</option>
                  <option value="Waxing">Waxing</option>
                  <option value="Detailing">Detailing</option>
                </select>
              </div>
            </div>

            {/* Live Search */}
            <div className="relative" id="cw-search-box">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, plate number, ticket, car wash attendant name..."
                className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Quick Aggregate Indicators */}
            <div className="grid grid-cols-2 gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-center" id="cw-aggregated-microstats">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Intake Revenue</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{formatNaira(localStats.totalSales)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block font-bold">Vehicles Cleaned</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{localStats.totalCount} Tickets</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-700/50 rounded-xl" id="cw-sales-table-scroller">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700/50">
                  <tr>
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle Plate</th>
                    <th className="p-3">Service Details</th>
                    <th className="p-3">Total (₦)</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 dark:text-slate-300">
                  {searchedSales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        <Droplet className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-60" />
                        No Car Wash records matching criteria.
                      </td>
                    </tr>
                  ) : (
                    searchedSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-mono font-medium text-green-600 dark:text-green-400">{sale.receiptNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold">{sale.customerName}</div>
                          <div className="text-[10px] text-slate-400">{sale.customerPhone}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded text-[10px]">
                            {sale.vehicleNumberPlate}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1">{sale.vehicleType}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{sale.serviceType}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                            {sale.timeIn} - {sale.timeOut}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-850 dark:text-white">{formatNaira(sale.amount)}</td>
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
                        <td className="p-3 text-right flex gap-1 justify-end">
                          <button
                            onClick={() => setActiveReceipt(sale)}
                            title="Print Wash Ticket"
                            className="p-1 text-slate-500 hover:text-green-600 dark:hover:text-green-400 rounded transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {(currentRole === 'Administrator' || currentRole === 'Cashier') && (
                            <button
                              onClick={() => {
                                if (confirm('Are you absolutely certain you wish to wipe this service account record?')) {
                                  onDeleteSale(sale.id);
                                  showToast('Record deleted.', 'info');
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                              title="Delete Service Ticket"
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

      {/* TICKET POPUP OR PRINT IN TRANSIT PANEL */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" id="cw-receipt-modal">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-3xl">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                  <Droplet className="w-4 h-4 text-green-500" /> Car Wash Service Receipt
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activeReceipt.receiptNumber}</p>
              </div>
              <button 
                onClick={() => setActiveReceipt(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Selection Layout Formats */}
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
                  Thermal Slip (58mm)
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Direct Print
              </button>
            </div>

            {/* Print Area inside Modal Wrapper */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50 dark:bg-slate-900/20" id="receipt-print-wrapper">
              <div 
                id="receipt-print-area" 
                className={`mx-auto bg-white text-black p-6 shadow-sm border border-slate-200 rounded-md font-mono ${
                  printFormat === 'thermal' ? 'max-w-[280px] text-[10px]' : 'max-w-[480px] text-xs'
                }`}
              >
                
                {/* Header Title block */}
                <div className="text-center space-y-1">
                  <svg className="w-10 h-10 mx-auto text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  <h2 className="text-sm font-bold tracking-tight uppercase">SBU CAR WASH CENTRAL</h2>
                  <p className="text-[9px] text-slate-600">Plot 104, Gas Plant Industrial Way, Lekki Phase 1, Lagos</p>
                  <p className="text-[9px] text-slate-600">Tel: +234 1 293 4000 • Web: www.gaswashpos.com</p>
                  <div className="border-t border-dashed border-gray-400 my-2"></div>
                </div>

                {/* Receipt Purpose */}
                <p className="text-center font-bold uppercase tracking-wider text-[11px] mb-3">VEHICLE INTAKE CLEAN SLIP</p>

                {/* Field Details */}
                <table className="w-full text-left space-y-1">
                  <tbody>
                    <tr>
                      <td className="text-slate-600">BOOKED ON:</td>
                      <td className="text-right">{new Date(activeReceipt.date).toLocaleString('en-US')}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">TICKET No:</td>
                      <td className="text-right font-bold text-blue-800">{activeReceipt.receiptNumber}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">CUSTOMER:</td>
                      <td className="text-right">{activeReceipt.customerName}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">PHONE No:</td>
                      <td className="text-right">{activeReceipt.customerPhone}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">PLATE NUMBER:</td>
                      <td className="text-right font-bold uppercase text-slate-900">{activeReceipt.vehicleNumberPlate}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">VEHICLE TYPE:</td>
                      <td className="text-right font-semibold uppercase">{activeReceipt.vehicleType}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">INTAKE TIME:</td>
                      <td className="text-right">{activeReceipt.timeIn}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600">EST. DEPARTURE:</td>
                      <td className="text-right">{activeReceipt.timeOut}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Service Details Breakdown */}
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="border-b border-gray-400 font-bold">
                      <th>SERVICES RENDERED</th>
                      <th className="text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">Manual {activeReceipt.serviceType} treatment</td>
                      <td className="text-right py-1 font-bold">{formatNaira(activeReceipt.amount)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-3"></div>

                {/* grand figures summary */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-xs uppercase">
                    <span>Net Amount Charged:</span>
                    <span>{formatNaira(activeReceipt.amount)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Payment Method:</span>
                    <span className="font-bold uppercase text-green-700">{activeReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Wash Host:</span>
                    <span>{activeReceipt.attendant}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Cashier Stamp:</span>
                    <span>{activeReceipt.cashier}</span>
                  </div>
                </div>

                {/* Remarks if present */}
                {activeReceipt.remarks && (
                  <div className="bg-slate-50 p-2 border border-slate-200 text-[9px] rounded-lg mt-3">
                    <span className="font-bold block text-slate-600">MEMO INSTRUCTIONS:</span>
                    <span>{activeReceipt.remarks}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-400 my-4"></div>

                <div className="text-center space-y-1 text-[9px] text-slate-600">
                  <p className="font-bold uppercase">THANK YOU FOR CHOOSING OUR CLEANING CENTER!</p>
                  <p>Check vehicle gloveboxes & items before collection</p>
                  <p>GasPlant & CarWash Operations Hub Integration</p>
                </div>

              </div>
            </div>

            {/* Close footer button */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end bg-slate-50 dark:bg-slate-900 rounded-b-3xl">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg text-xs font-semibold"
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
